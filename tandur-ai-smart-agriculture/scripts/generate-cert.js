import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const certDir = join(__dirname, '..', 'certs');
const keyPath = join(certDir, 'localhost-key.pem');
const certPath = join(certDir, 'localhost.pem');

// Create certs directory if it doesn't exist
if (!existsSync(certDir)) {
  mkdirSync(certDir, { recursive: true });
  console.log('Created certs directory');
}

// Check if certificates already exist
if (!existsSync(keyPath) || !existsSync(certPath)) {
  console.log('Generating self-signed certificate...');
  
  // Generate private key and certificate
  execSync(
    `openssl req -x509 -newkey rsa:4096 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`,
    { stdio: 'inherit' }
  );
  
  console.log('\nSelf-signed certificate generated successfully!');
  console.log(`Key: ${keyPath}`);
  console.log(`Cert: ${certPath}`);
} else {
  console.log('Certificate files already exist. Skipping generation.');
}
