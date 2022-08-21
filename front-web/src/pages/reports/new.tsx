import { Box, Paper, Typography } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import ReportForm from 'components/Forms/ReportForm';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Head } from '../../components/Head';
import { Page } from '../../components/Page';
import makeHttp from '../../utils/http';

const ReportsNewPage: NextPage = () => {
  const { initialized, keycloak } = useKeycloak();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await makeHttp().post('reports', data);
      router.push(`/reports`);
    } catch (e) {
      console.error(e);
    }
  };

  if (
    typeof window !== 'undefined' &&
    initialized &&
    !keycloak?.authenticated
  ) {
    router.replace(`/login?from=${window!.location.pathname}`);
    return null;
  }

  return keycloak?.authenticated ? (
    <Page>
      <Head title="Novo relatório" />
      <Box marginX={30} marginY={10}>
        <Paper>
          <Box p={2}>
            <Box mb={2}>
              <Typography component="h1" variant="h4">
                Novo relatório
              </Typography>
            </Box>
          </Box>
          <ReportForm onSubmit={onSubmit} />
        </Paper>
      </Box>
    </Page>
  ) : null;
};

export default ReportsNewPage;
