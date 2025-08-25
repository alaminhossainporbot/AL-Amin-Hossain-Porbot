import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Award, Building } from 'lucide-react';
import { useCertificates } from '@/hooks/usePortfolioData';

const Certificates = () => {
  const { data: certificates = [], isLoading, error } = useCertificates();

  if (isLoading) {
    return (
      <section id="certificates" className="section-standard">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
            <div className="h-12 bg-muted rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certificates" className="section-standard">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load certificates at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="section-standard bg-gradient-subtle">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Certifications & Achievements
        </Badge>
        <h2 className="text-gradient mb-6">
          Professional Qualifications
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Certifications and professional achievements that validate my expertise 
          in technology and education.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center">
          <Card className="card-premium max-w-2xl mx-auto bg-accent/5 border-accent/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Certificates Coming Soon
                </h4>
                <p className="text-muted-foreground text-sm">
                  Professional certifications will appear here once added to the Google Sheets database.
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Powered by Google Sheets API
              </Badge>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-8">
          {certificates.map((certificate, index) => (
            <Card 
              key={certificate.id}
              className="card-glow group overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="space-y-6">
                {/* Certificate Image */}
                {certificate.imageUrl && (
                  <div className="relative overflow-hidden rounded-lg bg-muted">
                    <img 
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Certificate Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                        {certificate.title}
                      </h3>
                      <Badge variant="default" className="ml-2 shrink-0">
                        <Award className="w-3 h-3 mr-1" />
                        Certified
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {certificate.issuer}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {certificate.date}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {certificate.description}
                  </p>

                  {/* View Credential Button */}
                  {certificate.credentialUrl && (
                    <div className="pt-2">
                      <Button 
                        size="sm" 
                        className="w-full group/btn"
                        variant="outline"
                        asChild
                      >
                        <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          View Credential
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Google Sheets Integration Notice */}
      <div className="mt-16 text-center">
        <Card className="card-premium max-w-2xl mx-auto bg-accent/5 border-accent/20">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto">
              <ExternalLink className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Dynamic Certification Management
              </h4>
              <p className="text-muted-foreground text-sm">
                Certificates are automatically fetched from Google Sheets. 
                Update the "Certificates" sheet to add new achievements and qualifications.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Powered by Google Sheets API
            </Badge>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Certificates;