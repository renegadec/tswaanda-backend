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
import { categories } from "../constants/index";
import { v4 as uuidv4 } from "uuid";
import { backendActor } from "../../config";
import { useSelector, useDispatch } from 'react-redux'
import { uploadFile } from "../../storage-config/functions";

function FarmerListing({ isOpen, onClose, setProductsUpdated }) {

  const { storageInitiated } = useSelector((state) => state.global)

  const [minOrder, setMinOrder] = useState(null);
  const [farmerName, setFarmerName] = useState("");
  const [farmerEmail, setFarmerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmDescription, setFarmDescription] = useState("");
  const [produceCategory, setProduceCategory] = useState("");
  const [farmerStatus, setFarmerStatus] = useState(false);

  const [saving, setSaving] = useState(false);

  const [uploads, setUploads] = useState([]);
  const [imgCount, setImgCount] = useState(null)
  const [uploading, setUpLoading] = useState(false);

  const handleImageInputChange = (e) => {
    setloadingImages(true);
    const files = Array.from(e.target.files);
    const selected = files.slice(0, 4);
    setImgCount(selected.length)
    setUploads(selected);
  };

  useEffect(() => {
    if (uploads.length >= 4) {
      setloadingImages(false);
    }
  }, [uploads]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (uploading || saving) {
      console.log("Currently busy")
    } else {
      try {
        const urls = await uploadAssets();
        console.log("Images saved, urls here", urls);
        setSaving(true);
        if (urls) {
          const newProduct = {
            id: uuidv4(),
            name: productName,
            price: parseInt(price),
            minOrder: parseInt(minOrder),
            shortDescription: shortDescription,
            fullDescription: fullDesc,
            category: category,
            weight: parseInt(weight),
            availability: availability,
            images: urls,
          };

          await backendActor.createProduct(newProduct);
          setProductsUpdated(true);
          setSaving(false)
          onClose();
        }

      } catch (error) {
        console.log(error);
      }
    }

  };

  const uploadAssets = async () => {
    if (storageInitiated && uploads) {
      setUpLoading(true);
      const file_path = location.pathname;
      const assetsUrls = [];

      for (const image of uploads) {
        try {
          const assetUrl = await uploadFile(image, file_path);
          assetsUrls.push(assetUrl);
          console.log("This file was successfully uploaded:", image.name);
          setImgCount(prevCount => prevCount - 1);
        } catch (error) {
          console.error("Error uploading file:", image.name, error);
        }
      }
      setUpLoading(false);
      console.log("Assets urls here", assetsUrls);
      return assetsUrls;
    }
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
          List a new Farmer
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            value={farmerEmail}
            onChange={(e) => setFarmerEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Farm Name"
            type="text"
            fullWidth
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={farmLocation}
            onChange={(e) => setFarmLocation(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={farmDescription}
            onChange={(e) => setFarmDescription(e.target.value)}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Produce Category</InputLabel>
            <Select
              labelId="category-label"
              value={produceCategory}
              onChange={(e) => setProduceCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="availability-label">Status</InputLabel>
            <Select
              labelId="availability-label"
              value={farmerStatus}
              onChange={(e) => setFarmerStatus(e.target.value)}
            >
              <MenuItem value="Available">Verified</MenuItem>
              <MenuItem value="Out of stock">Unverified</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
          
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
            {uploading && `Uploading images... ${imgCount}`}
            {saving && "Saving product..."}
            {!uploading && !saving && "Add Farmer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default FarmerListing;
