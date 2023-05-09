import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";
import { tswaanda_backend } from "../../../../declarations/tswaanda_backend/index";
import { categories } from "../constants/index";

const UpdateProduct = ({
  productInfo,
  setProductsUpdated,
  isOpen,
  onClose,
}) => {
  const [id, setId] = useState(productInfo.id);
  const [minOrder, setMinOrder] = useState(productInfo.minOrder);
  const [productName, setProductName] = useState(productInfo.name);
  const [shortDescription, setShortDescription] = useState(
    productInfo.shortDescription
  );
  const [fullDesc, setFullDesc] = useState(productInfo.fullDescription);
  const [price, setPrice] = useState(productInfo.price);
  const [category, setCategory] = useState(productInfo.category);
  const [weight, setWeight] = useState(
    productInfo.additionalInformation.weight
  );
  const [availability, setAvailability] = useState(
    productInfo.additionalInformation.availability
  );
  const [image, setImage] = useState(null);
  const [imageBytesData, setBytesImage] = useState(productInfo.image);

  const handleImageChange = async (e) => {
    setImage(e.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (image) {
      const imageData = [...new Uint8Array(await image.arrayBuffer())];
      setBytesImage(imageData)
    }

    const updatedProduct = {
      name: productName,
      image: imageBytesData,
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
    await tswaanda_backend.updateProduct(id, updatedProduct);
    setProductsUpdated(true);
    onClose();
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
          Update product {productInfo.id}
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Weight"
            rows={3}
            type="number"
            fullWidth
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="availability-label">Availability</InputLabel>
            <Select
              labelId="availability-label"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Out of stock">Out of stock</MenuItem>
            </Select>
          </FormControl>
          <TextField
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
            onChange={handleImageChange}
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
            Update product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateProduct;
