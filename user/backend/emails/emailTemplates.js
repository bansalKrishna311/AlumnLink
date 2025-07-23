// Logo URL for email templates
const LOGO_URL = `${process.env.CLIENT_URL}/logo copy.png`;

export function createWelcomeEmailTemplate(name, profileUrl) {
  const logoUrl = LOGO_URL;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to AlumnLink</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
    <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="${logoUrl}" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to AlumnLink!</h1>
    </div>
    <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
      <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${name},</strong></p>
      <p>We're excited to welcome you to AlumnLink, your hub for alumni connections, events, and career growth!</p>
      <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0;"><strong>Get started by:</strong></p>
        <ul style="padding-left: 20px;">
          <li>Completing your profile to showcase your journey</li>
          <li>Connecting with fellow alumni in your field</li>
          <li>Exploring job opportunities and industry events</li>
          <li>Sharing your experiences and insights with the community</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">Complete Your Profile</a>
      </div>
      <p>Join a vibrant community of professionals who are ready to support your career journey. The possibilities are endless when you're connected!</p>
      <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
    </div>
  </body>
  </html>
  `;
}

export function createLinkAcceptedEmailTemplate(senderName, recipientName, profileUrl) {
  const logoUrl = LOGO_URL;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Request Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="${logoUrl}" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">Link Accepted!</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${senderName},</strong></p>
    <p>Great news! <strong>${recipientName}</strong> has accepted your Link request on AlumnLink.</p>
    <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-size: 16px; margin: 0;"><strong>What's next?</strong></p>
      <ul style="padding-left: 20px;">
        <li>Check out ${recipientName}'s full profile and connect further</li>
        <li>Start a conversation and collaborate</li>
        <li>Explore alumni networks, events, and opportunities together</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${profileUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View ${recipientName}'s Profile</a>
    </div>
    <p>Expanding your alumni network opens new doors. Stay engaged and keep growing!</p>
    <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;
}

export function createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent) {
  const logoUrl = LOGO_URL;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Comment on Your Post</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="${logoUrl}" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">New Comment!</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p><strong>${commenterName}</strong> commented on your post:</p>
    <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${commentContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${postUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Post & Reply</a>
    </div>
    <p>Stay connected with your alumni community!</p>
    <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;
}

export function createLikeNotificationEmailTemplate(recipientName, likerName, postUrl, postContent) {
  const logoUrl = LOGO_URL;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Someone Liked Your Post</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="${logoUrl}" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">Your Post Got a Like!</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p><strong>${likerName}</strong> liked your post:</p>
    <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;">${postContent}</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${postUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Post</a>
    </div>
    <p>Keep sharing valuable content with your network!</p>
    <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;
}

export function createReplyNotificationEmailTemplate(recipientName, replierName, postUrl, replyContent) {
  const logoUrl = LOGO_URL;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Reply to Your Comment</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="${logoUrl}" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">New Reply!</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p><strong>${replierName}</strong> replied to your comment:</p>
    <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${replyContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${postUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Conversation</a>
    </div>
    <p>Join the discussion and keep the conversation going!</p>
    <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;
}

export function createMentionNotificationEmailTemplate(recipientName, mentionerName, postUrl, postContent) {
  const logoUrl = LOGO_URL;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Were Mentioned</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="${logoUrl}" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">You Were Mentioned!</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p><strong>${mentionerName}</strong> mentioned you in a post:</p>
    <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;">${postContent}</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${postUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Post</a>
    </div>
    <p>See what the community is saying about you!</p>
    <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;
}

export function createPostStatusEmailTemplate(recipientName, reviewerName, postStatus, postUrl, postContent, feedback) {
  const logoUrl = LOGO_URL;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="${logoUrl}" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">Post Status Update</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p>Your post has been <strong>${postStatus}</strong> by ${reviewerName}.</p>
    <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Your post:</strong></p>
      <p style="font-style: italic; margin: 10px 0;">"${postContent}"</p>
      ${feedback ? `<p style="margin: 10px 0;"><strong>Feedback:</strong> ${feedback}</p>` : ''}
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${postUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Post</a>
    </div>
    <p>Thank you for contributing to the AlumnLink community!</p>
    <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;
}
