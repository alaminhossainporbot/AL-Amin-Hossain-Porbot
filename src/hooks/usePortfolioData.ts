import { useQuery } from '@tanstack/react-query';
import { googleSheetsService } from '@/lib/googleSheetsService';
import { googleAppsScriptAuth } from '@/lib/googleAppsScriptAuth';

export const usePersonalInfo = () => {
  return useQuery({
    queryKey: ['personalInfo'],
    queryFn: () => googleSheetsService.getPersonalInfo(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    enabled: googleAppsScriptAuth.verifySession(), // Only fetch if session is valid
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => googleSheetsService.getSkills(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: googleAppsScriptAuth.verifySession(), // Only fetch if session is valid
  });
};

export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: () => googleSheetsService.getCertificates(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: googleAppsScriptAuth.verifySession(), // Only fetch if session is valid
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => googleSheetsService.getProjects(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: googleAppsScriptAuth.verifySession(), // Only fetch if session is valid
  });
};

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => googleSheetsService.getBlogPosts(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: googleAppsScriptAuth.verifySession(), // Only fetch if session is valid
  });
};

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: () => googleSheetsService.getContactInfo(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: googleAppsScriptAuth.verifySession(), // Only fetch if session is valid
  });
};

export const useAllPortfolioData = () => {
  return useQuery({
    queryKey: ['allPortfolioData'],
    queryFn: () => googleSheetsService.getAllData(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: googleAppsScriptAuth.verifySession(), // Only fetch if session is valid
  });
};