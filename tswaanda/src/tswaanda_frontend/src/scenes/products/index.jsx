import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";

import UpLoadProduct from "../../scenes/upload";
import { tswaanda_backend } from "../../../../declarations/tswaanda_backend/index";
import UpdateProduct from "../update/index";

const Product = ({
  id,
  name,
  image,
  description,
  price,
  addInfo,
  images,
  minOrder,
  fullDesc,
  rating,
  category,
  supply,
  stat,

  updateProducts,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateButton = () => {
    setIsOpen(true);
  };

  const handleUpdatePopClose = () => {
    setIsOpen(false);
  };

  const productInfo = {
    id: id,
    name: name,
    image: image,
    price: price,
    minOrder: minOrder,
    shortDescription: description,
    fullDescription: fullDesc,
    category: category,
    additionalInformation: addInfo,
    images: images
  };

  const handleDelete = async () => {
    await tswaanda_backend.deleteProduct(id);
    updateProducts(true);
  };

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[400]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />

        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
        <Button
          variant="primary"
          size="small"
          onClick={handleUpdateButton}
          // onClick={() => setIsExpanded(!isExpanded)}
        >
          Update
        </Button>
        {isOpen && (
          <UpdateProduct
            productInfo={productInfo}
            setProductsUpdated={updateProducts}
            isOpen={isOpen}
            onClose={handleUpdatePopClose}
          />
        )}
        <Button variant="primary" size="small" onClick={handleDelete}>
          <DeleteIcon />
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{ color: theme.palette.neutral[300] }}
      >
        <CardContent>
          <Typography>id: {id}</Typography>
          <Typography>Supply Left: {supply}</Typography>
          <Typography>
            Yearly Sales This Year: {stat.yearlySaleTotal}
          </Typography>
          <Typography>
            Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const theme = useTheme();

  // Fetching products from motoko backend

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productsUpdated, setProductsUpdated] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    const products = await tswaanda_backend.getAllProducts();
    setProducts(products);
    setLoading(false);
    setProductsUpdated(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (productsUpdated) {
      getProducts();
    }
  }, [productsUpdated]);

  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const [isOpen, setIsOpen] = useState(false);

  const handleUpLoadButton = () => {
    setIsOpen(true);
  };

  const handleUpLoadPopClose = () => {
    setIsOpen(false);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PRODUCTS" subtitle="List of products." />
        <Button
          variant="contained"
          onClick={handleUpLoadButton}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <AddIcon sx={{ mr: "10px" }} />
          Add New Product
        </Button>
        {isOpen && (
          <UpLoadProduct
            setProductsUpdated={setProductsUpdated}
            isOpen={isOpen}
            onClose={handleUpLoadPopClose}
          />
        )}
      </Box>

      {products || !loading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {products?.map(
            ({
              id,
              name,
              image,
              minOrder,
              shortDescription,
              fullDescription,
              price,
              rating,
              category,
              additionalInformation,
              images,
              supply,
              stat,
            }) => (
              <Product
                key={id}
                id={id}
                name={name}
                image={image}
                minOrder={minOrder}
                description={shortDescription}
                fullDesc={fullDescription}
                addInfo={additionalInformation}
                images={images}
                price={price}
                rating="4"
                category={category}
                supply="supply"
                stat="stats"
                updateProducts={setProductsUpdated}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
