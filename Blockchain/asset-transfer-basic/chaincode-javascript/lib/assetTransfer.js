/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const asset = [
            {
                ID: 'asset-master',
                Type: 'asset',
                Owner: 'admin',
                Status: 'init',
            },
        ];

        asset.docType = 'asset';
        await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
        console.info(`Asset ${asset.ID} initialized`);
    }

    // CreateAsset issues a new asset to the world state with given details.
    async Register(ctx, username, first_name, last_name) {
        const user = {
            Type: 'user',
            Username: username,
            FirstName: first_name,
            LastName: last_name,
            Token: 0,
            LastUpdated: new Date(),
        };
        return ctx.stub.putState(username, Buffer.from(JSON.stringify(user)));
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async GetUser(ctx, username) {
        const assetJSON = await ctx.stub.getState(username); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The user ${username} does not exist`);
        }
        return assetJSON.toString();
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, id, category, name, price, username) {
        const asset = {
            ID: id,
            Type: 'asset',
            Category: category,
            Name: name,
            Owner: username,
            Price: parseInt(price),
            Status: 'issued',
            LastUpdated: new Date(),
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }


    async BuyAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);

        const buyerString = await this.ReadAsset(ctx, newOwner);
        const buyer = JSON.parse(buyerString);

        if (!buyer) {
            throw new Error(`user ${newOwner} does not exist`);
        }

        if (!asset || asset.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }

        if (asset.Owner === newOwner) {
            throw new Error('Asset ' + asset.ID + ' can not be bought by the owner');
        }

        if (asset.Status !== 'issued') {
            throw new Error('Asset ' + asset.ID + ' can not be bought. Status=' + asset.Status);
        }

        const sellerString = await this.ReadAsset(ctx, asset.Owner);
        const seller = JSON.parse(sellerString);

        if (!seller) {
            throw new Error(`user ${asset.Owner} does not exist`);
        }

        if (parseInt(buyer.Token) < parseInt(asset.Price)) {
            throw new Error(`token user ${buyer.Username} not enough. Token = ${buyer.Token}. Price = ${asset.Price}`);
        }

        // create SAK ETAP
        const oldOwnerRecord = {
            ID: 'purchased_' + asset.ID,
            Type: 'sak-etap',
            Category: asset.Category,
            Name: asset.name,
            Owner: asset.Owner,
            Buyer: newOwner,
            Price: parseInt(asset.Price),
            Status: 'sold',
            LastUpdated: new Date(),
        }
        ctx.stub.putState(oldOwnerRecord.ID, Buffer.from(JSON.stringify(oldOwnerRecord)));

        // create SAK ETAP
        const newOwnerRecord = {
            ID: 'purchased_' + asset.ID,
            Type: 'sak-etap',
            Category: asset.Category,
            Name: asset.name,
            Owner: asset.Owner,
            Buyer: newOwner,
            Price: parseInt(asset.Price),
            Status: 'purchased',
            LastUpdated: new Date(),
        }
        ctx.stub.putState(newOwnerRecord.ID, Buffer.from(JSON.stringify(newOwnerRecord)));

        // change owner and status asset
        asset.Owner = newOwner;
        asset.Status = 'purchased';
        asset.LastUpdated = new Date();

        //send token
        seller.Token = parseInt(seller.Token) + parseInt(asset.Price); 
        buyer.Token = parseInt(buyer.Token) - parseInt(asset.Price);

        ctx.stub.putState(seller.Username, Buffer.from(JSON.stringify(seller)));
        ctx.stub.putState(buyer.Username, Buffer.from(JSON.stringify(buyer)));

        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }


    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }


    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }


    // GetAllAssets returns all assets found in the world state.
    async GetMyAssets(ctx, username) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.Type !== 'asset' || record.Owner !== username) {
                result = await iterator.next();
                continue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async GetIssuedAssets(ctx, username) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.Status !== 'issued' || record.Owner == username) {
                result = await iterator.next();
                continue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async GetReportAdmin(ctx, username, receiver) {
        
        if (username !== 'admin') {
            throw new Error('Token can only be issued by admin');
        }

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.Type !== 'sak-etap' || (record.Owner !== username && record.Buyer !== username)) {
                result = await iterator.next();
                continue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


    async GetMyReport(ctx, username) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.Type !== 'sak-etap' || (record.Owner !== username && record.Buyer !== username)) {
                result = await iterator.next();
                continue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // CreateAsset issues a new asset to the world state with given details.
    async IssueToken(ctx, username, amount) {
        const assetString = await this.ReadAsset(ctx, username);
        const asset = JSON.parse(assetString);

        if (username !== 'admin') {
            throw new Error('Token can only be issued by admin');
        }

        var admin = {};
        if (asset) {
            admin = {
                Type: asset.Type,
                Username: asset.Username,
                FirstName: asset.FirstName,
                LastName: asset.LastName,
                Token: parseInt(asset.Token) + parseInt(amount),
                LastUpdated: new Date(),
            };
        } else {
            admin = {
                Type: 'admin',
                Username: username,
                FirstName: username,
                LastName: username,
                Token: parseInt(amount),
                LastUpdated: new Date(),
            };
        }

        return ctx.stub.putState(username, Buffer.from(JSON.stringify(admin)));
    }

    async SendToken(ctx, username, recipient, amount) {
        const assetString = await this.ReadAsset(ctx, username);
        const admin = JSON.parse(assetString);

        if (username !== 'admin') {
            throw new Error('Token can only be sent by admin');
        }

        if (admin && admin.Token >= amount) {
            const userString = await this.ReadAsset(ctx, recipient);
            const user = JSON.parse(userString);
            if (user) {
                const userObj = {
                    Type: user.Type,
                    Username: user.Username,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Token: parseInt(amount) + parseInt(user.Token),
                    LastUpdated: new Date(),
                };
                ctx.stub.putState(user.Username, Buffer.from(JSON.stringify(userObj)));

                const adminObj = {
                    Type: admin.Type,
                    Username: admin.Username,
                    FirstName: admin.FirstName,
                    LastName: admin.LastName,
                    Token: parseInt(admin.Token) - parseInt(amount),
                    LastUpdated: new Date(),
                };
                return ctx.stub.putState(admin.Username, Buffer.from(JSON.stringify(adminObj)));

            } else {
                throw new Error('Invalid recipient');
            }
        } else {
            throw new Error('There is no enough Token. Issue the token first');
        }
    }

}

module.exports = AssetTransfer;
