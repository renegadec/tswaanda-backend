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
        image : Blob;
        minOrder : Int32;
        shortDescription : Text;
        fullDescription : Text;
        category : Text;
        images : Images;
        additionalInformation : AdditionalInformation;
    };
    public type AdditionalInformation = {
        price : Int32;
        weight : Int32;
        availability : Text;
    };

    public type Images = {
        image1 : Blob;
        image2 : Blob;
        image3 : Blob;
    };
}