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
  const [mainImage, setMainImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  // const [image4, setImage4] = useState(null);
  const [mainImageBytes, setBytesImage] = useState(productInfo.image);
  const [image1Bytes, setImage1Bytes] = useState(
    productInfo.images.image1
  );
  const [image2Bytes, setImage2Bytes] = useState(
    productInfo.images.image2
  );
  const [image3Bytes, setImage3Bytes] = useState(
    productInfo.images.image3
  );
  // const [image4Bytes, setImage4Bytes] = useState(
  //   productInfo.images.image4
  // );
  const [updating, setUpdating] = useState(false);

  const handleImageChange = async (e) => {
    setMainImage(e.target.files[0]);
    setImage1(e.target.files[1]);
    setImage2(e.target.files[2]);
    setImage3(e.target.files[3]);
    // setImage4(e.target.files[4]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setUpdating(true);

    if (mainImage) {
      const mainImageData = [...new Uint8Array(await mainImage.arrayBuffer())];
      setBytesImage(mainImageData);
    }
    if (image1) {
      const image1Data = [...new Uint8Array(await image1.arrayBuffer())];
      setImage1Bytes(image1Data);
    }
    if (image2) {
      const image2Data = [...new Uint8Array(await image2.arrayBuffer())];
      setImage2Bytes(image2Data);
    }
    if (image3) {
      const image3Data = [...new Uint8Array(await image3.arrayBuffer())];
      setImage3Bytes(image3Data);
    }
    // if (image4) {
    //   const image4Data = [...new Uint8Array(await image4.arrayBuffer())];
    //   setImage4Bytes(image4Data);
    // }

    const updatedProduct = {
      name: productName,
      image: mainImageBytes,
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
      images: {
        image1: image1Bytes,
        image2: image2Bytes,
        image3: image3Bytes,
        // image4: image4Bytes,
      },
    };
    await tswaanda_backend.updateProduct(id, updatedProduct);
    setProductsUpdated(true);
    setUpdating(false);
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
            // inputProps={{
            //   accept: "image/*",
            // }}
            inputProps={{
              multiple: true,
            }}
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
          disabled={updating}
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
