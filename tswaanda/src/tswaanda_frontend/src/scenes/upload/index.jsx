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

function UpLoadProduct({ isOpen, onClose, setProductsUpdated }) {
  const [minOrder, setMinOrder] = useState(null);
  const [productName, setProductName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState(null);
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState(null);
  const [availability, setAvailability] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [uploadingImages, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  //   const [dimensions, setDimensions] = useState("");
  //   const [farmerId, setFarmerId] = useState("");

  const handleImageInputChange = (e) => {
    setUploading(true);
    setMainImage(e.target.files[0]);
    setImage1(e.target.files[1]);
    setImage2(e.target.files[2]);
    setImage3(e.target.files[3]);
  };

  useEffect(() => {
    if (mainImage && image1 && image2 && image3) {
      setUploading(false);
    }
  }, [mainImage, image1, image2, image3]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSaving(true)

    const mainImageBytes = [...new Uint8Array(await mainImage.arrayBuffer())];
    const image1Bytes = [...new Uint8Array(await image1.arrayBuffer())];
    const image2Bytes = [...new Uint8Array(await image2.arrayBuffer())];
    const image3Bytes = [...new Uint8Array(await image3.arrayBuffer())];

    const newProduct = {
      name: productName,
      price: parseInt(price),
      image: mainImageBytes,
      minOrder: parseInt(minOrder),
      shortDescription: shortDescription,
      fullDescription: fullDesc,
      category: category,
      additionalInformation: {
        price: parseInt(price),
        weight: parseInt(weight),
        availability: availability,
      },
      smallImages: {
        image1: image1Bytes,
        image2: image2Bytes,
        image3: image3Bytes,
      },
    };

    await tswaanda_backend.createProduct(newProduct);
    setProductsUpdated(true);
    setSaving(false)
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
            onChange={handleImageInputChange}
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
            disabled={uploadingImages || saving}
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
