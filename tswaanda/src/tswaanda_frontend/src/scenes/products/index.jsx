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
import Header from "../../components/Header";
import { useGetProductsQuery } from "../../state/api";

import UpLoadProduct from "../../scenes/upload";
import { tswaanda_backend } from "../../../../declarations/tswaanda_backend/index";

const Product = ({
  id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

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
  const { data, isLoading } = useGetProductsQuery();

  // Fetching products from motoko backend

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postUpdated, setPostsUpdated] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    const products = await tswaanda_backend.getAllProducts();
    setProducts(products);
    setLoading(false);
    setPostsUpdated(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (postUpdated) {
      getProducts();
    }
  }, [postUpdated]);

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
            setPostsUpdated={setPostsUpdated}
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
              shortDescription,
              price,
              rating,
              category,
              supply,
              stat,
            }) => (
              <Product
                key={id}
                id={id}
                name={name}
                description={shortDescription}
                price={price}
                rating="4"
                category={category}
                supply="supply"
                stat="stats"
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
