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
import { Actor, HttpAgent } from "@dfinity/agent";
import { canisterId, idlFactory } from "../../../../declarations/tswaanda_backend/index";
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
  const [mainImageBytes, setBytesImage] = useState(productInfo.image);
  const [image1Bytes, setImage1Bytes] = useState(productInfo.images.image1);
  const [image2Bytes, setImage2Bytes] = useState(productInfo.images.image2);
  const [image3Bytes, setImage3Bytes] = useState(productInfo.images.image3);
  const [updating, setUpdating] = useState(false);
  const [uploadingImages, setUploading] = useState(false);

  const host = "https://icp0.io";
  const agent = new HttpAgent({ host: host });

  const backendActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId,
  });

  const handleImageChange = async (e) => {
    setUploading(true);
    setMainImage(e.target.files[0]);
    setImage1(e.target.files[1]);
    setImage2(e.target.files[2]);
    setImage3(e.target.files[3]);
  };

  const convertToBytes = async (image) => {
    const imageBytes = [...new Uint8Array(await image.arrayBuffer())];
    return imageBytes;
  };

  useEffect(() => {
    if (mainImage && image1 && image2 && image3) {
      const update = async () => {
        setBytesImage(await convertToBytes(mainImage));
        setImage1Bytes(await convertToBytes(image1));
        setImage2Bytes(await convertToBytes(image2));
        setImage3Bytes(await convertToBytes(image3));
        setUploading(false);
      };
      update();
    }
  }, [mainImage, image1, image2, image3]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setUpdating(true);

    const updatedProduct = {
      id: id,
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
      },
    };
    await backendActor.updateProduct(id, updatedProduct);
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
            disabled={updating || uploadingImages}
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
