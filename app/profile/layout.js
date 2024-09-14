import ButtonAccount from "@/components/ButtonAccount";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page

export default function Layout({ children }) {
  return (
    <div>
      <nav>
        <ButtonAccount />
      </nav>
      <main>{children}</main>
    </div>
  );
}

