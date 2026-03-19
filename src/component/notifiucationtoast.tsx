import React from "react";

interface Props {
  title?: string;
  body?: string;
}

const NotificationToast: React.FC<Props> = ({ title, body }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div>
        <div style={{ fontWeight: "600", fontSize: "14px" }}>{title}</div>
        <div style={{ fontSize: "13px", opacity: 0.8 }}>{body}</div>
      </div>
    </div>
  );
};

export default NotificationToast;
