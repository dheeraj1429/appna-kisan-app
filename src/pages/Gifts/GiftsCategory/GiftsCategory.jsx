import EditIcon from "@mui/icons-material/Edit";
import { Avatar, IconButton, Stack, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "src/components/Spinner";
import { axiosInstance } from "src/services/axios.service";
import DeleteIcon from "@mui/icons-material/Delete";

function GiftsCategory() {
  const [giftCategories, setGiftCategories] = useState([]);
  const navigation = useNavigate();

  const allCategories = async function () {
    try {
      const response = await axiosInstance.get(`/gift/get-gift-categories`);
      if (!!response && response?.data?.categories.length) {
        const rows = [];
        const { categories } = response.data;

        for (let i = 0; i < categories.length; i++) {
          rows.push({
            name: categories[i].name,
            image: categories[i].categoryImages?.[0]?.image_url,
            createdAt: categories[i].createdAt,
            _id: categories[i]._id,
          });
        }

        setGiftCategories(rows);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(giftCategories);

  useEffect(() => {
    allCategories();
  }, []);

  return (
    <div>
      <LoadingSpinner loading={false} />
      <Stack
        marginBottom={2}
        spacing={2}
        direction="row"
        display={"flex"}
        justifyContent={"end"}
        alignItems={"end"}
      >
        <Button
          variant="contained"
          onClick={() => navigation("/dashboard/create-gift-categories/create")}
        >
          Create Gift Category
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Gift Categories</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!giftCategories && giftCategories.length
              ? giftCategories.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">
                      <Stack
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        direction="row"
                        spacing={2}
                      >
                        <Avatar alt="logo" src={row.image} />
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(row.createdAt).format("MMM DD YYYY hh:mm:ss A")}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() =>
                            navigation(
                              `/dashboard/create-gift-categories/${row._id}`
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GiftsCategory;
