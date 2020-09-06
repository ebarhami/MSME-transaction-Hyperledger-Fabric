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
    async CreateAsset(ctx, id, category, name, owner, price) {
        const asset = {
            ID: id,
            Type: 'asset',
            Category: category,
            Name: name,
            Owner: owner,
            Price: price,
            Status: 'issued',
            LastUpdated: new Date(),
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }


    async BuyAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);

        if (!asset || asset.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }

        if (asset.Owner === newOwner) {
            throw new Error('Asset ' + asset.ID + ' can not be bought by the owner');
        }

        if (asset.Status !== 'issued') {
            throw new Error('Asset ' + asset.ID + ' can not be bought. Status=' + asset.Status);
        }

        // create SAK ETAP
        const purchasedAsset = {
            ID: 'purchased_' + asset.ID,
            Type: 'sak-etap',
            Category: asset.Category,
            Name: asset.name,
            Owner: asset.Owner,
            Price: asset.Price,
            Status: 'purchased',
            LastUpdated: new Date(),
        }
        ctx.stub.putState(purchasedAsset.ID, Buffer.from(JSON.stringify(purchasedAsset)));

        // change owner and status asset
        asset.Owner = newOwner;
        asset.Status = 'purchased';
        asset.LastUpdated = new Date();

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
    async GetMyAssets(ctx, owner) {
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
            if (record.Type !== 'asset' || record.Owner !== owner) {
                result = await iterator.next();
                continue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async GetIssuedAssets(ctx) {
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
            if (record.Status !== 'issued') {
                result = await iterator.next();
                continue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async GetMyReport(ctx, owner) {
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
            if (record.Type !== 'sak-etap' || record.Owner !== owner) {
                result = await iterator.next();
                continue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

}

module.exports = AssetTransfer;
