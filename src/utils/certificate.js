// Improved certificate generator (no signatures or avatar)
export async function generateCertificateBlob({
  name = 'Student',
  courseTitle = 'Course',
  date = null,
  platform = 'SkillForge',
  details = {},
  instructor = '',
  certificateId = '',
  referenceUrl = '',
  courseLength = '',
  subtitle = ''
}) {
  const width = 1600;
  const height = 1150;

  const canvas = Object.assign(document.createElement('canvas'), {
    width,
    height
  });
  const ctx = canvas.getContext('2d');

  // Soft background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#f4f8fb');
  bg.addColorStop(1, '#e8ecef');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Gold border and subtle shadow effect
  ctx.save();
  ctx.lineWidth = 16;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(32, 32, width - 64, height - 64);
  ctx.restore();

  // Left vertical accent bar (inspired by Scaler)
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.globalAlpha = 0.08;
  ctx.fillRect(0, 0, 210, height);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Title: Certificate of Completion
  ctx.font = '700 44px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#21233e';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 180);

  // Certificate metadata (top-right)
  ctx.font = '17px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#717885';
  ctx.textAlign = 'right';
  if (certificateId)
    ctx.fillText(`Certificate ID: ${certificateId}`, width - 90, 55);
  if (referenceUrl) ctx.fillText(`Verify: ${referenceUrl}`, width - 90, 85);

  // Platform & logo (top right, bold)
  ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#2e3ca6';
  ctx.textAlign = 'right';
  ctx.fillText(platform, width - 95, 145);

  // Subtitle/Secondary line
  ctx.font = '24px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#475060';
  ctx.textAlign = 'center';
  ctx.fillText(
    subtitle || 'Awarded for successfully completing',
    width / 2,
    240
  );

  // Course Title (big, bold)
  ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#0b2447';
  ctx.textAlign = 'center';
  ctx.fillText(courseTitle, width / 2, 335);

  // Student name (bold highlight)
  ctx.font = 'bold 52px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#083c9e';
  ctx.fillText(name, width / 2, 425);

  // Middle divider line
  ctx.strokeStyle = '#b6c2e0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 260, 455);
  ctx.lineTo(width / 2 + 260, 455);
  ctx.stroke();

  // Details: Date, Instructor, Course Length, etc
  ctx.font = '20px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#345';
  ctx.textAlign = 'center';
  const awardedDate = date || new Date().toLocaleDateString();
  const detailsArr = [
    courseLength ? `Course Length: ${courseLength}` : '',
    instructor ? `Instructor: ${instructor}` : '',
    `Issued by ${platform}`,
    `Awarded on ${awardedDate}`
  ].filter(Boolean);

  detailsArr.forEach((line, i) => {
    ctx.fillText(line, width / 2, 510 + i * 32);
  });

  // Body: Civic text block ("This certifies...")
  ctx.font = '21px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#42526b';
  ctx.textAlign = 'center';
  ctx.fillText(
    `This is to certify that ${name} has demonstrated successful mastery of "${courseTitle}".`,
    width / 2,
    650
  );

  // Extra blocks for details.description or custom content
  if (details && details.description) {
    ctx.font = '19px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#4c5377';
    ctx.textAlign = 'center';
    ctx.fillText(details.description, width / 2, 690);
  }

  // Watermark in background
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.font = 'bold 320px Georgia, serif';
  ctx.fillStyle = '#182243';
  ctx.fillText(
    (courseTitle[0] || 'S').toUpperCase(),
    width / 2,
    height / 2 + 140
  );
  ctx.restore();

  // Footer
  ctx.font = '17px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#8795a1';
  ctx.textAlign = 'center';
  ctx.fillText(
    `This certificate is issued digitally and can be verified via ${platform}.`,
    width / 2,
    height - 38
  );

  // Output blob
  return await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.97);
  });
}
