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

actor Store {
    public type Id = Nat32;
    private stable var next : Id = 0;

    type Product = {        
        name: Text;
        price: Int32;
        minOrder: Int32;
        description: Text;
        category: Text;    
    };

    type ProductWithId = {  
        id: Id;      
        name: Text;
        price: Int32;
        minOrder: Int32;
        description: Text;
        category: Text;    
    };

    // the data structure to store the products.
    private stable var products : Trie.Trie<Id, Product> = Trie.empty();       

    // adds new product 
    public func addProduct (newProduct: Product) : async Id {
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

    public query func findAll () : async [ProductWithId]  {
        let productsAsArray = Trie.toArray<Id, Product, ProductWithId>(products, transform);
        return productsAsArray;
    };

    public query func findProductById(id : Id) : async ?Product {
        let result = Trie.find(products, key(id), eq);
        return result;
    };

    private func transform(id:Id, prd:Product): ProductWithId{
        let newProductWithId : ProductWithId = {
            id = id; 
            name = prd.name;
            price =  prd.price;
            minOrder = prd.minOrder;
            description = prd.description;
            category = prd.category;
        };
        return newProductWithId;
    };

    private func eq(x : Id, y : Id) : Bool {
        return x == y;
    };

    private func key(x : Id) : Trie.Key<Id> {
        return { hash = x; key = x };
    };
};