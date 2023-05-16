/**
 * Module     : main.mo
 * Copyright  : Confidence Nyirenda
 * License    : MIT
 * Maintainer : Isheanesu Misi <isheanesu@tswaanda.com>
 * Stability  : Stable
 */

import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Trie "mo:base/Trie";
import Int32 "mo:base/Int32";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";

actor Store {
    public type Id = Nat32;
    private stable var next : Id = 0;

    type Product = {
        name : Text;
        price : Int32;
        image : [Nat8];
        minOrder : Int32;
        shortDescription : Text;
        fullDescription : Text;
        category : Text;
        images : SmallImages;
        additionalInformation : AdditionalInformation;
    };

    type ProductWithId = {
        id : Id;
        name : Text;
        price : Int32;
        image : [Nat8];
        minOrder : Int32;
        shortDescription : Text;
        fullDescription : Text;
        category : Text;
        additionalInformation : AdditionalInformation;
        images : SmallImages;
    };

    type AdditionalInformation = {
        price : Int32;
        weight : Int32;
        availability : Text;
    };

    type SmallImages = {
        image1 : [Nat8];
        image2 : [Nat8];
        image3 : [Nat8];
        // image4 : [Nat8];
    };

    // the data structure to store the products.
    private stable var products : Trie.Trie<Id, Product> = Trie.empty();

    // adds new product
    public func createProduct(newProduct : Product) : async Id {
        let id = next;
        next +%= 1;
        products := Trie.replace(
            products,
            key(id),
            eq,
            ?newProduct,
        ).0;

        return id;
    };

    public query func getAllProducts() : async [ProductWithId] {
        if (Trie.size(products) == 0) {
            return [];
        } else {
            let productsAsArray = Trie.toArray<Id, Product, ProductWithId>(products, transform);
            return productsAsArray;
        };
    };

    public query func getProductById(id : Id) : async ?Product {
        let result = Trie.find(products, key(id), eq);
        return result;
    };

    private func transform(id : Id, prd : Product) : ProductWithId {
        let newProductWithId : ProductWithId = {
            id = id;
            name = prd.name;
            price = prd.price;
            image = prd.image;
            minOrder = prd.minOrder;
            shortDescription = prd.shortDescription;
            fullDescription = prd.fullDescription;
            category = prd.category;
            additionalInformation = prd.additionalInformation;
            images = prd.images;
        };
        return newProductWithId;
    };

    private func eq(x : Id, y : Id) : Bool {
        return x == y;
    };

    private func key(x : Id) : Trie.Key<Id> {
        return { hash = x; key = x };
    };

    public func updateProduct(productId : Id, product : Product) : async Bool {
        let existingProduct = Trie.find(products, key(productId), eq);
        if (existingProduct == null) {
            return false;
        };
        products := Trie.replace(
            products,
            key(productId),
            eq,
            ?product,
        ).0;
        return true;
    };

    public func deleteProduct(productId : Id) : async Bool {
        let existingProduct = Trie.find(products, key(productId), eq);
        if (existingProduct == null) {
            return false;
        };
        products := Trie.remove(products, key(productId), eq).0;
        return true;
    };
};
