// mail types

var mailType = {
  Payment: {
    type: "Payment",
    subject: "Payment Confirmation | ORACLE",
  },
  News: { type: "News", subject: "News | ORACLE" },
  Registration: { type: "Registration", subject: "Account Creation | ORACLE" },
  DuePayment: { type: "Due-Payment", subject: "Due Payment Notice | ORACLE" },
};

module.exports = mailType;
