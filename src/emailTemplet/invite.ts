export const getInviteEmailTemplet = (inviteLink:string) => {
  const html = `
<div style="font-family: Arial, sans-serif; padding: 20px;">
  
  <h2>You are invited for Admin</h2>

  <p>Please click the button below to accept the invitation.</p>

  <a 
    href="${inviteLink}" 
    style="
      display: inline-block;
      padding: 12px 20px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 10px;
    "
  >
    Accept Invite
  </a>

</div>
`;

  return html;
};
