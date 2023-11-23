import React, { useState, useEffect } from 'react'
import LoadingSpinner from 'src/components/Spinner'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Stack } from '@mui/material';
import { getAllB2bApprovalAccounts } from 'src/api/b2bApproval';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function B2bApprovalList() {
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigate()

  const getAccountsHandler = async function() {
    try {
      setIsLoading(true)
      const response = await getAllB2bApprovalAccounts()
      console.log(response)
      if(response) {
        setIsLoading(false)
      }
    }catch(err) {
      setIsLoading(false)
      console.log('some error occurred')
    }
  }

  useEffect(() => {
    getAccountsHandler()
  }, [page])

  return (
    <div>
      <LoadingSpinner loading={isLoading} />
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat</TableCell>
            <TableCell align="right">Carbs</TableCell>
            <TableCell align="right">Protein</TableCell>
            <TableCell align="right">Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope='row'>
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit" placement='top'>
                    <IconButton onClick={() => navigation(`/dashboard/b2b-approval/1`)}>
                      <EditIcon fontSize='small' />
                    </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Stack display={'flex'} alignItems={'end'} justifyContent={'end'}>
      <Stack direction="row" spacing={1} marginTop={1}>
        <Button onClick={() => setPage(prev => prev - 1)} disabled={!page ? true : false} startIcon={<NavigateBeforeIcon />} color='primary' variant='contained' size='small'>Prev</Button>
        <Button onClick={() => setPage(prev => prev + 1)} endIcon={<NavigateNextIcon />} color='primary' variant="contained" size='small'>Next</Button>
      </Stack>
    </Stack>
    </div>
  )
}

export default B2bApprovalList