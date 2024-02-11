db.txs.aggregate([
    { $match: { currency: /eur/i } },
    {
        $sample: {
            size: 2
        }
    }
])

db.clients.aggregate([
  {
    $lookup: {
      from: "txs",
      localField: "_id",
      foreignField: "sender_id",
      as: "transactions"
    }
  },
  {
    $match: {
      transactions: { $size: 0 }
    }
  },
  {
    $project: {
      _id: 0,
      name: 1
    }
  }
])

db.clients.aggregate([
    {
        $lookup: {
            from: "txs",
            localField: "_id",
            foreignField: "sender_id",
            as: "transactions"
        }
    },
    {
        $unwind: "$transactions"
    },
    {
        $match: {
            "transactions.currency": /eur/i
        }
    },
    {
        $group: {
            _id: "$_id",
            name: { $first: "$name" },
            totalEURSent: { $sum: "$transactions.amount" }
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            totalEURSent: 1
        }
    }
])