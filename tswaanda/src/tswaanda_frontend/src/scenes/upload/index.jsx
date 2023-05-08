import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { tswaanda_backend } from "../../../../declarations/tswaanda_backend/index";

function UpLoadProduct({ isOpen, onClose, setPostsUpdated }) {
  const [minOrder, setMinOrder] = useState(null);
  const [productName, setProductName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState(null);
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState(null);
  const [availability, setAvailability] = useState("");
  //   const [productImage, setProductImage] = useState(null);
  //   const [dimensions, setDimensions] = useState("");
  //   const [farmerId, setFarmerId] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const newProduct = {
      name: productName,
      price: parseInt(price),
      minOrder: parseInt(minOrder),
      shortDescription: shortDescription,
      fullDescription: fullDesc,
      category: category,
      additionalInformation: {
        price: parseInt(price),
        weight: parseInt(weight),
        availability: availability,
      },
    };

    const productId = await tswaanda_backend.createProduct(newProduct);
    setPostsUpdated(true)

    console.log(productId);

    onClose();
    // const formData = new FormData();
    // formData.append("productName", productName);
    // formData.append("shortDescription", shortDescription);
    // formData.append("fullDesc", fullDesc);
    // formData.append("price", price);
    // formData.append("dimensions", dimensions);
    // for (let i = 0; i < 4; i++) {
    //   formData.append("productImages", productImage[i]);
    // }
    // formData.append("farmerId", farmerId);

    // try {
    //   const response = await axios.post("/api/products", formData);
    //   console.log(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "green",
          }}
        >
          Upload a new product
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product name"
            type="text"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Minimum order"
            type="number"
            fullWidth
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Full Description"
            multiline
            rows={3}
            type="text"
            fullWidth
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
          />

          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Category"
            multiline
            rows={3}
            type="text"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Weight"
            multiline
            rows={3}
            type="number"
            fullWidth
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Availability"
            multiline
            rows={3}
            type="text"
            fullWidth
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          {/* <TextField
            margin="dense"
            label="Dimensions"
            type="text"
            fullWidth
            value={dimensions}
            onChange={handleDimensions}
          /> */}
          {/* <TextField
            margin="dense"
            label="Farmer ID"
            type="text"
            fullWidth
            value={farmerId}
            onChange={handleFarmerIdChange}
          /> */}
          {/* <TextField
            margin="dense"
            label="Image files"
            type="file"
            inputProps={{
              accept: "image/*",
            }}
            // inputProps={{
            //   multiple: true,
            // }}
            fullWidth
            onChange={handleImageFileChange}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Add product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UpLoadProduct;
