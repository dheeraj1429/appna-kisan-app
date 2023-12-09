import React, { useState, useEffect } from "react";
import LoadingSpinner from "src/components/Spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import { getAllB2bApprovalAccounts } from "src/api/b2bApproval";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

function B2bApprovalList() {
  const [page, setPage] = useState(0);
  const [userLists, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const navigation = useNavigate();

  const getAccountsHandler = async function () {
    try {
      setIsLoading(true);
      const response = await getAllB2bApprovalAccounts({ page });
      if (response) {
        setIsLoading(false);
        const { data, totalPages } = response.data;
        const rows = data.map((item) => ({
          _id: item._id,
          owner_name: item.owner_name,
          mobile: item?.mobile,
          company_name: item?.company_name,
          email: item?.email,
          is_approved: item?.is_approved,
        }));
        setTotalPages(totalPages);
        setUserList(rows);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("some error occurred");
    }
  };

  useEffect(() => {
    getAccountsHandler();
  }, [page]);

  return (
    <div>
      <LoadingSpinner loading={isLoading} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Owner name</TableCell>
              <TableCell align="center">Mobile</TableCell>
              <TableCell align="center">Company name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Approved</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userLists.map((row) => (
              <TableRow
                key={row?._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row?.owner_name}
                </TableCell>
                <TableCell align="center">{row?.mobile}</TableCell>
                <TableCell align="center">{row?.company_name}</TableCell>
                <TableCell align="center">{row?.email}</TableCell>
                <TableCell align="center">
                  {row?.is_approved ? "Yes" : "No"}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit" placement="top">
                    <IconButton
                      onClick={() =>
                        navigation(`/dashboard/b2b-approval/${row?._id}`)
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack display={"flex"} alignItems={"end"} justifyContent={"end"}>
        <Stack direction="row" spacing={1} marginTop={1}>
          <Button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!page ? true : false}
            startIcon={<NavigateBeforeIcon />}
            color="primary"
            variant="contained"
            size="small"
          >
            Prev
          </Button>
          <Button
            disabled={totalPages && totalPages > page ? false : true}
            onClick={() => setPage((prev) => prev + 1)}
            endIcon={<NavigateNextIcon />}
            color="primary"
            variant="contained"
            size="small"
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default B2bApprovalList;
