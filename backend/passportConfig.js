import { readFileSync } from 'fs';
import fs from 'fs'
import { parseString } from 'xml2js';
import passport from 'passport';
import { Strategy as SamlStrategy } from '@node-saml/passport-saml';

const idpCertificate = fs.readFileSync("./certs/shibboleth-test_tu-berlin_de_cert.pem", 'utf-8');

// Metadaten-Datei lesen
const metadataFile = './metadata/shibboleth-test.tu-berlin.de_metadata.xml';
const metadata = readFileSync(metadataFile, 'utf-8');

let samlOptions = {
  callbackUrl: 'http://localhost:3000/login/callback',
  issuer: 'https://shibboleth-test.tu-berlin.de/idp/shibboleth',
  cert: idpCertificate
};

//let idpCertFromMetadata = idpCertificate;
//console.log('Backup Zertifikat:', idpCertFromMetadata);

parseString(metadata, (err, result) => {
  if (err) {
    console.error('Fehler beim Parsen der Metadaten:', err);
    return;
  }

  // Greife auf EntityDescriptor zu
  const entityDescriptor = result?.EntitiesDescriptor?.EntityDescriptor?.[0];
  if (!entityDescriptor) {
    console.error('EntityDescriptor nicht gefunden in den Metadaten.');
    return;
  }

  // Greife auf IDPSSODescriptor zu
  const idpSSODescriptor = entityDescriptor.IDPSSODescriptor?.[0];
  if (!idpSSODescriptor) {
    console.error('IDPSSODescriptor nicht gefunden in den Metadaten.');
    return;
  }

  // Extrahiere SingleSignOnService mit HTTP-Redirect
  const idpSSO = idpSSODescriptor.SingleSignOnService?.find(
    (service) => service.$.Binding.includes('HTTP-Redirect')
  );
  if (idpSSO) {
    samlOptions.entryPoint = idpSSO.$.Location;
  } else {
    console.error('SingleSignOnService mit HTTP-Redirect nicht gefunden.');
  }

  // Extrahiere X509-Zertifikat
  const signingKeyDescriptor = idpSSODescriptor.KeyDescriptor?.find((key) => key.$.use === 'signing');
  if (signingKeyDescriptor) {
    const x509Certificate =
      signingKeyDescriptor['ds:KeyInfo']?.[0]['ds:X509Data']?.[0]['ds:X509Certificate']?.[0];
    if (x509Certificate) {
        // idpCertFromMetadata = x509Certificate;
        // console.log('Extrahiertes Zertifikat:', idpCertFromMetadata);
    } else {
      console.error('X509Certificate nicht gefunden in den Metadaten.');
    }
  } else {
    console.error('Signing KeyDescriptor nicht gefunden in den Metadaten.');
  }
});

//samlOptions.cert = idpCertFromMetadata;

console.log('samlOptions:', samlOptions);

// SAML-Strategie konfigurieren
const samlStrategy = new SamlStrategy(samlOptions, (profile, done) => {
  console.log('SAML Profile:', profile);
  return done(null, profile);
});

passport.use(samlStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;

/*import fs from 'fs';
import passport from 'passport';
import SamlStrategy from '@node-saml/passport-saml';

// Pfad zur Zertifikatdatei
const idpCertificate = fs.readFileSync('./certs/shibboleth-test.tu-berlin.de.pem', 'utf-8');

// SAML-Strategie konfigurieren
const samlStrategy = new SamlStrategy(
  {
    entryPoint: 'https://shibboleth-test.tu-berlin.de/idp/profile/SAML2/Redirect/SSO', // EntryPoint
    issuer: 'https://shibboleth-test.tu-berlin.de/idp/shibboleth', // EntityID des TestIDP
    cert: idpCertificate, // Zertifikat des TestIDP
    callbackUrl: 'http://localhost:3000/login/callback', // Callback-URL (muss mit deinem SAML-Setup übereinstimmen)
  },
  (profile, done) => {
    console.log('SAML Profile:', profile);
    return done(null, profile);
  }
);

// Passport-Strategie registrieren
passport.use(samlStrategy);

// Benutzer serialisieren/deserialisieren
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Exportiere Passport-Konfiguration
export default passport;*/
