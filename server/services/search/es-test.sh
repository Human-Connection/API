clear

echo "DELETE"

curl -XDELETE 'localhost:9200/my_store?pretty'

echo "MAPPING"

curl -XPUT 'localhost:9200/my_store?pretty' -H 'Content-Type: application/json' -d'
{
    "mappings" : {
        "title" : {
          "properties" : {
            "text": {
              "type": "string"
            }
          }
        },
        "content": {
          "properties" : {
            "text": {
              "type": "string"
            }
          }
        },
        "products" : {
            "properties" : {
                "productID" : {
                    "type" : "string",
                    "index" : "not_analyzed" 
                }
            }
        }
    }
}'


echo "INSERT"

curl -XPOST 'localhost:9200/my_store/products/_bulk?pretty' -H 'Content-Type: application/json' -d'
{ "index": { "_id": 20 }}
{ "price" : 10, "productID" : "XHDK-A-1293-#fJ3", "title": "title A", "content": "content A" }
'

echo "SEARCH"

curl -XGET 'localhost:9200/my_store/products/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query" : {
        "constant_score" : {
            "filter" : {
                "term" : {
                    "productID" : "XHDK-A-1293-#fJ3"
                }
            }
        }
    }
}
'