/**
 * Google Apps Script Backend for Portfolio Admin Panel
 * Deploy this script to Google Apps Script and update the SCRIPT_URL in googleAppsScriptAuth.ts
 * 
 * Required Google Sheets structure:
 * - "AdminUsers" sheet: Username | Password | Permissions | LastLogin | Status
 * - "AdminConfig" sheet: Setting | Value
 * - "AuditLog" sheet: Timestamp | Username | Action | Details | IP
 */

// Configuration
const ADMIN_SPREADSHEET_ID = 'YOUR_ADMIN_SPREADSHEET_ID'; // Replace with your admin spreadsheet ID
const PORTFOLIO_SPREADSHEET_ID = 'YOUR_PORTFOLIO_SPREADSHEET_ID'; // Replace with your portfolio spreadsheet ID

// Sheet names
const SHEETS = {
  ADMIN_USERS: 'AdminUsers',
  ADMIN_CONFIG: 'AdminConfig',
  AUDIT_LOG: 'AuditLog',
  PERSONAL_INFO: 'Home',
  PROJECTS: 'Portfolio',
  SKILLS: 'Skills',
  CERTIFICATES: 'Certificates',
  BLOG_POSTS: 'Blog',
  CONTACT_INFO: 'Contact'
};

/**
 * Main entry point for HTTP requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = e.parameter.action;
    
    // CORS headers
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    };

    switch (action) {
      case 'authenticate':
        return handleAuthentication(data);
      case 'getAdminConfig':
        return handleGetAdminConfig(data);
      case 'updateAdminSettings':
        return handleUpdateAdminSettings(data);
      case 'getAuditLogs':
        return handleGetAuditLogs(data);
      case 'logAction':
        return handleLogAction(data);
      case 'getPortfolioData':
        return handleGetPortfolioData(data);
      case 'updatePortfolioData':
        return handleUpdatePortfolioData(data);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('doPost error:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * Handle preflight OPTIONS requests
 */
function doGet(e) {
  return ContentService
    .createTextOutput('{"status":"ok"}')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
}

/**
 * Create standardized response
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().getTime()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
}

/**
 * Handle user authentication
 */
function handleAuthentication(data) {
  try {
    const { username, password } = data;
    
    if (!username || !password) {
      return createResponse(false, 'Username and password are required');
    }

    const adminSheet = getSheet(ADMIN_SPREADSHEET_ID, SHEETS.ADMIN_USERS);
    const userData = findUserByUsername(adminSheet, username);
    
    if (!userData) {
      logAuditAction('LOGIN_FAILED', username, 'User not found');
      return createResponse(false, 'Invalid credentials');
    }

    // Simple password verification (in production, use proper hashing)
    if (userData.password !== password) {
      logAuditAction('LOGIN_FAILED', username, 'Invalid password');
      return createResponse(false, 'Invalid credentials');
    }

    if (userData.status !== 'Active') {
      logAuditAction('LOGIN_FAILED', username, 'Account disabled');
      return createResponse(false, 'Account is disabled');
    }

    // Update last login
    updateUserLastLogin(adminSheet, userData.row, new Date());
    
    // Log successful login
    logAuditAction('LOGIN_SUCCESS', username, 'User logged in');

    return createResponse(true, 'Authentication successful', {
      user: {
        username: userData.username,
        permissions: userData.permissions.split(',').map(p => p.trim())
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return createResponse(false, 'Authentication error: ' + error.message);
  }
}

/**
 * Get admin configuration
 */
function handleGetAdminConfig(data) {
  try {
    if (!verifySession(data)) {
      return createResponse(false, 'Invalid session', { error: 'INVALID_SESSION' });
    }

    const configSheet = getSheet(ADMIN_SPREADSHEET_ID, SHEETS.ADMIN_CONFIG);
    const values = configSheet.getDataRange().getValues();
    
    const config = {};
    values.slice(1).forEach(row => {
      if (row[0] && row[1] !== undefined) {
        config[row[0]] = row[1];
      }
    });

    logAuditAction('GET_CONFIG', data.sessionId, 'Retrieved admin configuration');
    return createResponse(true, 'Configuration retrieved', config);
  } catch (error) {
    console.error('Get config error:', error);
    return createResponse(false, 'Error retrieving configuration: ' + error.message);
  }
}

/**
 * Update admin settings
 */
function handleUpdateAdminSettings(data) {
  try {
    if (!verifySession(data)) {
      return createResponse(false, 'Invalid session', { error: 'INVALID_SESSION' });
    }

    const { settings } = data;
    const configSheet = getSheet(ADMIN_SPREADSHEET_ID, SHEETS.ADMIN_CONFIG);
    
    // Update settings in the sheet
    Object.entries(settings).forEach(([key, value]) => {
      updateConfigSetting(configSheet, key, value);
    });

    logAuditAction('UPDATE_SETTINGS', data.sessionId, `Updated settings: ${Object.keys(settings).join(', ')}`);
    return createResponse(true, 'Settings updated successfully');
  } catch (error) {
    console.error('Update settings error:', error);
    return createResponse(false, 'Error updating settings: ' + error.message);
  }
}

/**
 * Get audit logs
 */
function handleGetAuditLogs(data) {
  try {
    if (!verifySession(data)) {
      return createResponse(false, 'Invalid session', { error: 'INVALID_SESSION' });
    }

    const { limit = 50 } = data;
    const auditSheet = getSheet(ADMIN_SPREADSHEET_ID, SHEETS.AUDIT_LOG);
    const values = auditSheet.getDataRange().getValues();
    
    const logs = values.slice(1, limit + 1).map(row => ({
      timestamp: row[0],
      username: row[1],
      action: row[2],
      details: row[3],
      ip: row[4] || 'Unknown'
    }));

    return createResponse(true, 'Audit logs retrieved', { logs });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return createResponse(false, 'Error retrieving audit logs: ' + error.message);
  }
}

/**
 * Log action to audit trail
 */
function handleLogAction(data) {
  try {
    if (!verifySession(data)) {
      return createResponse(false, 'Invalid session', { error: 'INVALID_SESSION' });
    }

    const { action, details, username } = data;
    logAuditAction(action, username, details);
    
    return createResponse(true, 'Action logged');
  } catch (error) {
    console.error('Log action error:', error);
    return createResponse(false, 'Error logging action: ' + error.message);
  }
}

/**
 * Get portfolio data
 */
function handleGetPortfolioData(data) {
  try {
    if (!verifySession(data)) {
      return createResponse(false, 'Invalid session', { error: 'INVALID_SESSION' });
    }

    const portfolioData = {
      personalInfo: getSheetData(PORTFOLIO_SPREADSHEET_ID, SHEETS.PERSONAL_INFO),
      projects: getSheetData(PORTFOLIO_SPREADSHEET_ID, SHEETS.PROJECTS),
      skills: getSheetData(PORTFOLIO_SPREADSHEET_ID, SHEETS.SKILLS),
      certificates: getSheetData(PORTFOLIO_SPREADSHEET_ID, SHEETS.CERTIFICATES),
      blogPosts: getSheetData(PORTFOLIO_SPREADSHEET_ID, SHEETS.BLOG_POSTS),
      contactInfo: getSheetData(PORTFOLIO_SPREADSHEET_ID, SHEETS.CONTACT_INFO)
    };

    logAuditAction('GET_PORTFOLIO_DATA', data.username, 'Retrieved portfolio data');
    return createResponse(true, 'Portfolio data retrieved', portfolioData);
  } catch (error) {
    console.error('Get portfolio data error:', error);
    return createResponse(false, 'Error retrieving portfolio data: ' + error.message);
  }
}

/**
 * Update portfolio data
 */
function handleUpdatePortfolioData(data) {
  try {
    if (!verifySession(data)) {
      return createResponse(false, 'Invalid session', { error: 'INVALID_SESSION' });
    }

    const { sheetName, updates } = data;
    const sheet = getSheet(PORTFOLIO_SPREADSHEET_ID, sheetName);
    
    // Update the sheet with new data
    if (updates && updates.length > 0) {
      const range = sheet.getRange(1, 1, updates.length, updates[0].length);
      range.setValues(updates);
    }

    logAuditAction('UPDATE_PORTFOLIO_DATA', data.username, `Updated ${sheetName} sheet`);
    return createResponse(true, 'Portfolio data updated successfully');
  } catch (error) {
    console.error('Update portfolio data error:', error);
    return createResponse(false, 'Error updating portfolio data: ' + error.message);
  }
}

/**
 * Helper Functions
 */

function getSheet(spreadsheetId, sheetName) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  return spreadsheet.getSheetByName(sheetName);
}

function getSheetData(spreadsheetId, sheetName) {
  try {
    const sheet = getSheet(spreadsheetId, sheetName);
    return sheet.getDataRange().getValues();
  } catch (error) {
    console.error(`Error getting data from ${sheetName}:`, error);
    return [];
  }
}

function findUserByUsername(sheet, username) {
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === username) {
      return {
        row: i + 1,
        username: values[i][0],
        password: values[i][1],
        permissions: values[i][2] || 'admin',
        lastLogin: values[i][3],
        status: values[i][4] || 'Active'
      };
    }
  }
  return null;
}

function updateUserLastLogin(sheet, row, date) {
  sheet.getRange(row, 4).setValue(date);
}

function updateConfigSetting(sheet, key, value) {
  const values = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      found = true;
      break;
    }
  }
  
  if (!found) {
    // Add new setting
    sheet.appendRow([key, value]);
  }
}

function logAuditAction(action, username, details) {
  try {
    const auditSheet = getSheet(ADMIN_SPREADSHEET_ID, SHEETS.AUDIT_LOG);
    auditSheet.appendRow([
      new Date(),
      username,
      action,
      details,
      'Google Apps Script' // IP not available in Apps Script
    ]);
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}

function verifySession(data) {
  // Simple session verification - in production, implement proper session management
  return data.sessionId && data.timestamp && (new Date().getTime() - data.timestamp < 300000); // 5-minute window
}