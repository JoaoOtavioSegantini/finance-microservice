import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { TransactionCategoryLabels, TransactionTypeLabels } from 'utils/model';

type Props = {
  onSubmit: (data: any) => Promise<void>;
};
export default function TransactionForm({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register('payment_date')}
                type="date"
                required
                label="Data pagamento"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register('name')}
                label="Nome"
                required
                inputProps={{ maxLength: 255 }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register('description')}
                label="Descrição"
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register('category')}
                select
                required
                label="Categoria"
              >
                {TransactionCategoryLabels.map((i, key) => (
                  <MenuItem key={key} value={i.value}>
                    {i.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register('amount', { valueAsNumber: true })}
                required
                type="number"
                label="Valor"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register('type')}
                select
                required
                label="Tipo de operação"
              >
                {TransactionTypeLabels.map((i, key) => (
                  <MenuItem key={key} value={i.value}>
                    {i.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display={'flex'} gap={2}>
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
        </Grid>
      </form>
    </Box>
  );
}
