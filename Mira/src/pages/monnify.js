export const monnify = import ("https://sdk.monnify.com/plugin/monnify.js");


   function payWithMonnify() {
        monnify.initialize({
          amount: 100,
          currency: "NGN",
          reference: new String(new Date().getTime()),
          customerFullName: "Funke onakoya",
          customerEmail: "Funke@gmail.com",
          apiKey: "MK_PROD_XXXX",
          contractCode: "XXXXX",
          paymentDescription: "Test World",
          metadata: {
            name: "Funke",
            age: 21,
          },
          incomeSplitConfig: [
            {
              subAccountCode: "MFY_SUB_342113621921",
              feePercentage: 50,
              splitAmount: 1900,
              feeBearer: true,
            },
            {
              subAccountCode: "MFY_SUB_342113621922",
              feePercentage: 50,
              splitAmount: 2100,
              feeBearer: true,
            },
          ],
          onLoadStart: () => {
            console.log("loading has started");
          },
          onLoadComplete: () => {
            console.log("SDK is UP");
          },
          onComplete: function (response) {
            console.log(response);
          },
          onClose: function (data) {
            console.log(data);
          },
        });
      }

 