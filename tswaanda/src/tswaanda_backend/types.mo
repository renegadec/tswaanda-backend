import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Blob "mo:base/Blob";

module {

    public type Role = {
        #owner;
        #admin;
        #authorized;
    };

    public type Permission = {
        #assign_role;
        #lowest;
    };

    public type Product = {
        id: Text;
        name : Text;
        price : Int32;
        minOrder : Int32;
        shortDescription : Text;
        fullDescription : Text;
        category : Text;
        images : [Text];
        weight : Int32;
        availability : Text;
        // created: ?Int;
    };

    public type Farmer = {
        id: Text;
        name : Text;
        email : Text;
        phone : Text;
        company : Text;
        location : Text;
        description : Text;
        listedProducts : ?[Product];
        soldProducts : ?[Product];
        produceCategories : Text;
        created: ?Int;
    };

    public type ProductReview = {
        id: Text;
        productId : Text;
        userName : Text;
        userLastName : Text;
        rating : Int32;
        review : Text;
        created: ?Int;
    };
}