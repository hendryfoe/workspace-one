import { Metadata } from 'next';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Workspace One',
  description: 'Workspace One',
  icons: {
    shortcut: '/favicon.ico'
  }
};

export default function RootLayout(props: ChildrenProps) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
