import { NextPage } from 'next';
import { Page } from '../../components/Page';
import { Head } from '../../components/Head';
import { useRouter } from 'next/router';
import { useAuthSwr } from '../../hooks/useAuthSwr';
import { Box, Button, Link, Typography } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import { withAuth } from '../../hof/withAuth';
import makeHttp from '../../utils/http';
import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import { Download } from '@mui/icons-material';

type Report = {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  file_url: string;
  created_at: string;
};

const ReportsListPage: NextPage<{ reports: any }> = ({ reports }) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = useAuthSwr('reports', {
    refreshInterval: 20000,
    fallbackData: reports,
  });

  const rows: GridRowsProp = (data as Report[]).map((report) => ({
    id: report.id,
    start_date: new Date(report.start_date).toLocaleDateString('pt-BR'),
    end_date: new Date(report.end_date).toLocaleDateString('pt-BR'),
    status: report.status,
    file_url: report.file_url,
    created_at: new Date(report.created_at).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }),
  }));

  const columns: GridColDef[] = [
    { field: 'start_date', headerName: 'Início', flex: 1 },
    { field: 'end_date', headerName: 'Fim', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'file_url',
      headerName: 'Download',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Button
          startIcon={params.value ? <Download /> : undefined}
          variant={'contained'}
          style={{ margin: '0 10px' }}
          color="primary"
        >
          <Link href={params.value} rel="noreferrer" target="_blank">
            {params.value ? 'Link' : 'Aguarde...'}
          </Link>
        </Button>
      ),
    },

    { field: 'created_at', headerName: 'Criado em', flex: 1 },
  ];

  return (
    <Page>
      <Head title="Meus relatórios" />
      <Box maxWidth="lg" style={{ margin: '10px auto' }}>
        <Typography
          component="h1"
          variant="h4"
          color="textPrimary"
          gutterBottom
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          Relatórios
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            startIcon={<AddIcon />}
            variant={'contained'}
            color="primary"
            style={{ marginBottom: '1rem' }}
            onClick={() => router.push('/reports/new')}
          >
            Criar
          </Button>
        </Box>
        <Box sx={{ display: 'flex', height: 600 }}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            rowsPerPageOptions={[2, 20, 50, 100]}
            rows={rows}
            columns={columns}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Box>
      </Box>
    </Page>
  );
};

export default ReportsListPage;

export const getServerSideProps = withAuth(async (ctx, { token }) => {
  // const { data: reports } = await makeHttp(token).get('reports');
  // console.log(reports);

  return {
    props: {
      reports: [],
    },
  };
});
