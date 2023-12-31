import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import LoadingSpinner from "src/components/Spinner";
import { axiosInstance } from "src/services/axios.service";
import { toast } from "react-toastify";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function GiftProducts() {
  const [isLoading, setLoading] = useState(false);
  const [giftProducts, setGiftProducts] = useState([]);
  const navigation = useNavigate();

  const getAllGiftProducts = async function () {
    try {
      const response = await axiosInstance.get("/gift/get-all-gifts");
      if (!!response && response?.data?.gifts) {
        const { gifts } = response.data;
        setGiftProducts(gifts);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const deleteHandler = async function (giftId) {
    try {
      const response = await axiosInstance.delete(
        `/gift/delete-single-gift?giftId=${giftId}`
      );
      if (!!response && response?.data) {
        toast.success(response?.data?.message);
        setGiftProducts(giftProducts.filter((item) => item._id !== giftId));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllGiftProducts();
  }, []);

  return (
    <div>
      <LoadingSpinner loading={isLoading} />
      <Stack
        marginBottom={2}
        spacing={2}
        direction="row"
        display={"flex"}
        alignItems={"end"}
        justifyContent={"end"}
      >
        <Button
          variant="contained"
          onClick={() => navigation("/dashboard/create-gift-products/create")}
        >
          Add new gift product
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Gift collected points</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Gift category</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!giftProducts && giftProducts.length
              ? giftProducts.map((row) => (
                  <TableRow
                    key={row?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row?.name}</TableCell>
                    <TableCell align="center">
                      {row?.giftCollectedPoints}
                    </TableCell>
                    <TableCell align="center">{row?.quantity}</TableCell>
                    <TableCell align="center">
                      {row?.giftCategory?.name}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        {!!row?.giftImages && row?.giftImages.length
                          ? row.giftImages.map((item) => (
                              <Avatar alt="Images" src={item.image_url} />
                            ))
                          : null}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() =>
                            navigation(
                              `/dashboard/create-gift-products/${row._id}`
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => deleteHandler(row._id)}>
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

export default GiftProducts;
