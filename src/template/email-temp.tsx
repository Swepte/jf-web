const TemplateMail = (reference: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Authentication Code for the Job Fair</title>
      <style>
          /* General Reset */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: #121212; /* Dark background */
              color: #fff; /* White text for dark theme */
              padding: 20px;
          }

          /* Main container */
          .email-container {
              background-color: #1e1e1e; /* Dark grey background */
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              overflow: hidden;
          }

          /* Header */
          .email-header {
              background-color: #000000; /* Black background */
              padding: 20px;
              color: #fff;
              text-align: center;
          }

          .email-header img {
              width: 120px; /* Adjust the size of your logo */
              margin-bottom: 10px;
              filter: brightness(0) invert(1); /* Apply white filter to logo */
          }

          .email-header h1 {
              font-size: 24px;
              margin-bottom: 5px;
          }

          .email-header p {
              font-size: 14px;
          }

          /* Authentication Code Section */
          .auth-code-section {
              padding: 30px;
              background-color: #333333; /* Dark grey section */
              text-align: center;
          }

          .auth-code {
              font-size: 32px;
              font-weight: bold;
              color: #FF5722; /* Accent color (orange) */
              margin-top: 10px;
              padding: 10px 20px;
              background-color: #424242; /* Slightly lighter dark background */
              border-radius: 4px;
          }

          /* Instructions */
          .email-body {
              padding: 20px;
              font-size: 16px;
              color: #ccc; /* Lighter text for better readability */
              line-height: 1.6;
          }

          .email-body p {
              margin-bottom: 15px;
          }

          .email-body strong {
              color: #fff; /* White text for emphasis */
          }

          /* Footer */
          .email-footer {
              padding: 20px;
              background-color: #1e1e1e; /* Dark grey background */
              text-align: center;
              font-size: 14px;
              color: #777; /* Light grey text */
          }

          .email-footer img {
              width: 100px; /* Adjust the size of your logo */
              margin-top: 10px;
              filter: brightness(0) invert(1); /* Apply white filter to logo */
          }

          .email-footer a {
              color: #FF5722; /* Accent color for links */
              text-decoration: none;
          }

          /* Responsive */
          @media only screen and (max-width: 600px) {
              .email-container {
                  width: 100% !important;
                  padding: 0 15px;
              }
              .auth-code {
                  font-size: 28px !important;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <!-- Header with Logo -->
          <div class="email-header">
              <img src="https://cryptex-assets.s3.ap-southeast-1.amazonaws.com/logo/cryptex_384x384.svg" alt="Cryptex Logo">
              <h1>Authentication Code for the Job Fair</h1>
              <p>Thank you for registering for the upcoming Job Fair.</p>
          </div>

          <!-- Authentication Code Section -->
          <div class="auth-code-section">
              <p>Your Authentication Code is:</p>
              <div class="auth-code">
                  ${reference}
              </div>
          </div>

          <!-- Body -->
          <div class="email-body">
              <p>To complete your registration for the Job Fair, please enter the above Authentication Code on the Job Fair registration portal. If you did not initiate this request, please disregard this email.</p>
              <p>If you need assistance, please contact us at <a href="mailto:consult@cryptex.ph">[Support Email]</a>.</p>
          </div>

          <!-- Footer with Logo -->
          <div class="email-footer">
              <p>Best regards,<br>The Bluesands Team</p>
              <img src="https://cryptex-assets.s3.ap-southeast-1.amazonaws.com/logo/cryptex_128x128.svg" alt="Cryptex Logo">
              <br><br>
              <p><a href="https://cryptex.ph/">Visit our website</a> for more information.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

export default TemplateMail;
