import { Box, Button, FormControl, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type Props = {
  onSubmit: (data: any) => Promise<void>;
};

function ReportForm({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                {...register('start_date')}
                type="date"
                required
                label="Início"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                {...register('end_date')}
                type="date"
                required
                label="Fim"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display={'flex'} gap={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => router.back()}
              style={{ backgroundColor: 'white', color: 'black' }}
            >
              Voltar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </Grid>
      </form>
    </Box>
  );
}

export default ReportForm;
