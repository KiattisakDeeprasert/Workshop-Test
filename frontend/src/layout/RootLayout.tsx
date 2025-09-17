import React from "react";

type Props = { children: React.ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <div className="app-title">Task Manager</div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
