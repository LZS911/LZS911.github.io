import PageFooter from './page-footer';
import PageHeader from './page-header';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <PageHeader />
      <main className="p-6 flex justify-center">{children}</main>
      <PageFooter />
    </div>
  );
};

export default Layout;
