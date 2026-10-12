/* HOW TO USE (5 steps)
 1. Create a new Google Sheet (name it e.g. "Mahir Media enquiries").
 2. In the Sheet: Extensions > Apps Script. Delete the sample code and paste ALL of this file.
 3. Deploy > New deployment > type: Web app. Execute as: Me. Who has access: Anyone. Deploy, and approve the permissions.
 4. Copy the Web app URL (ends in /exec).
 5. Paste it into FORM_ENDPOINT in the Colab cell and run the cell again.
 New enquiries then appear as rows (Time, Name, Email, Phone) and are also emailed to you.
 After editing this script later, use Deploy > Manage deployments > Edit > New version. */
function doPost(e) {
  var p = e.parameter;
  if (p.website) return ok();                                  // honeypot: bots fill this hidden field
  var s = SpreadsheetApp.getActive().getSheets()[0];
  if (!s.getLastRow()) s.appendRow(['Time', 'Name', 'Email', 'Phone']);
  var stamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy HH:mm');
  s.getRange(s.getLastRow() + 1, 1, 1, 4).setNumberFormat('@')  // plain text: keeps +91 numbers intact, blocks formula injection
   .setValues([[stamp, p.name || '', p.email || '', p.phone || '']]);
  MailApp.sendEmail('you@example.com', 'New enquiry: ' + (p.name || ''),
    'Name: ' + p.name + '\nEmail: ' + p.email + '\nPhone: ' + (p.phone || '-'));
  return ok();
}
function ok() { return ContentService.createTextOutput('ok'); }
