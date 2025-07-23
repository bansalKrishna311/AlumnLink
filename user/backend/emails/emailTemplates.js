export function createWelcomeEmailTemplate(name, profileUrl) {
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
      <img src="../../client/public/logo copy.png" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to AlumnLink!</h1>
    </div>
    <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.07);">
      <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${name},</strong></p>
      <p>We're excited to welcome you to AlumnLink, your hub for alumni connections, events, and career growth!</p>
      <div style="background-color: #fd8e5e1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0;"><strong>Get started with these steps:</strong></p>
        <ul style="padding-left: 20px;">
          <li>Complete your profile to showcase your journey</li>
          <li>Connect with alumni, institutions, and administrators</li>
          <li>Join alumni networks and groups</li>
          <li>Explore events, news, and job opportunities</li>
          <li>Personalize your experience and privacy settings</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">Complete Your Profile</a>
      </div>
      <p>If you need help, our support team is here for you. Enjoy connecting and growing with AlumnLink!</p>
      <p style="color: #5E5E5E;">Best regards,<br>The AlumnLink Team</p>
    </div>
  </body>
  </html>
  `;
}

export const createLinkAcceptedEmailTemplate = (senderName, recipientName, profileUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Request Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3F2EF;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="../../client/public/logo copy.png" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
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
`

export const createCommentNotificationEmailTemplate = (recipientName, commenterName, postUrl, commentContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Comment on Your Post</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="../../client/public/logo copy.png" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">New Comment on Your Post</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p>${commenterName} has commented on your post:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${commentContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${postUrl} style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Comment</a>
    </div>
    <p>Stay engaged with your network by responding to comments and fostering discussions.</p>
    <p>Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;

export const createLikeNotificationEmailTemplate = (recipientName, likerName, postUrl, postContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Reaction on Your Post</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="../../client/public/logo copy.png" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">New Reaction on Your Post</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p>${likerName} reacted to your post:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${postContent.length > 100 ? postContent.substring(0, 100) + '...' : postContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${postUrl} style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Post</a>
    </div>
    <p>Stay engaged with your network by sharing more content and fostering discussions.</p>
    <p>Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;

export const createReplyNotificationEmailTemplate = (recipientName, replierName, postUrl, replyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Reply to Your Comment</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="../../client/public/logo copy.png" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">New Reply to Your Comment</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p>${replierName} replied to your comment:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${replyContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${postUrl} style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Reply</a>
    </div>
    <p>Continue the conversation and keep building connections with your network.</p>
    <p>Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;

export const createMentionNotificationEmailTemplate = (recipientName, mentionerName, postUrl, postContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've Been Mentioned in a Post</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="../../client/public/logo copy.png" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">You've Been Mentioned</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p>${mentionerName} mentioned you in a post:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${postContent.length > 100 ? postContent.substring(0, 100) + '...' : postContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${postUrl} style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Post</a>
    </div>
    <p>Join the conversation and engage with your network.</p>
    <p>Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;

export const createPostStatusEmailTemplate = (recipientName, reviewerName, postStatus, postUrl, postContent, feedback) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Post Has Been ${postStatus === 'approved' ? 'Approved' : 'Rejected'}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(90deg, #fe6019 0%, #fd8e5e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="../../client/public/logo copy.png" alt="AlumnLink Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">Post ${postStatus === 'approved' ? 'Approved' : 'Rejected'}</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #fe6019;"><strong>Hello ${recipientName},</strong></p>
    <p>Your post has been ${postStatus === 'approved' ? 'approved' : 'rejected'} by ${reviewerName}:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${postContent.length > 100 ? postContent.substring(0, 100) + '...' : postContent}"</p>
    </div>
    ${feedback ? `
    <div style="background-color: ${postStatus === 'approved' ? '#e6f7e6' : '#ffebeb'}; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${postStatus === 'approved' ? '#4CAF50' : '#FF5252'};">
      <p style="margin: 0;"><strong>Feedback:</strong> ${feedback}</p>
    </div>
    ` : ''}
    ${postStatus === 'approved' ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href=${postUrl} style="background-color: #fe6019; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background 0.3s;">View Post</a>
    </div>
    <p>Your post is now visible to the community. Thank you for contributing to AlumnLink!</p>
    ` : `
    <p>We encourage you to review the feedback and make any necessary adjustments before resubmitting your post.</p>
    `}
    <p>Best regards,<br>The AlumnLink Team</p>
  </div>
</body>
</html>
`;
