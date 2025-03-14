const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const PropertyType = require("./Property_type"); // Import PropertyType model

const Property = sequelize.define(
    "Property",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        property_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        youtube: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        postal_code: {
            type: DataTypes.STRING,
        },
        property_type: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: PropertyType, // References PropertyType model
                key: "prop_type", // Uses prop_type as the key
            },
            onDelete: "SET NULL", // If property type is deleted, keep the property but set type as NULL
        },

        action: {
            type: DataTypes.ENUM("for_sale", "for_lease", "shortlet"),
            allowNull: false,
        },
        number_of_units: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        size_in_sqft: {
            type: DataTypes.DECIMAL,
        },
        bedrooms: {
            type: DataTypes.INTEGER,
        },
        bathrooms: {
            type: DataTypes.INTEGER,
        },
        rent_price: {
            type: DataTypes.INTEGER,
        },
        lease_status: {
            type: DataTypes.ENUM("available", "occupied", "under_construction", "under_maintenance", "closed"),
            defaultValue: "available",
        },
        picture: {
            type: DataTypes.STRING,
        },
        prop_id: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        timestamps: true,
        tableName: "property",
    }
);

// **Associations**
Property.belongsTo(PropertyType, {
    foreignKey: "property_type",
    targetKey: "prop_type",
    onDelete: "SET NULL",
});

module.exports = Property;
