

# https://www.elastic.co/guide/en/elasticsearch/guide/current/_indexing_employee_documents.html

echo "DELETE"

curl -XDELETE 'localhost:9200/megacorp?pretty'

echo "++++++++++++ insert data "

curl -XPUT 'localhost:9200/megacorp/employee/1?pretty' -H 'Content-Type: application/json' -d'
{
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
}
'
curl -XPUT 'localhost:9200/megacorp/employee/2?pretty' -H 'Content-Type: application/json' -d'
{
    "first_name" :  "Jane",
    "last_name" :   "Smith",
    "age" :         32,
    "about" :       "I like to collect rock albums",
    "interests":  [ "music" ]
}
'
curl -XPUT 'localhost:9200/megacorp/employee/3?pretty' -H 'Content-Type: application/json' -d'
{
    "first_name" :  "Douglas",
    "last_name" :   "Fir",
    "age" :         35,
    "about":        "I like to build cabinets",
    "interests":  [ "forestry" ]
}
'


echo "++++++++++++++ retrieve data"
curl -XGET 'localhost:9200/megacorp/employee/1?pretty'


echo "+++++++++ search all ..."
curl -XGET 'localhost:9200/megacorp/employee/_search?pretty'


echo "++ search by field"
curl -XGET 'localhost:9200/megacorp/employee/_search?q=last_name:Smith&pretty'


curl -XGET 'localhost:9200/megacorp/employee/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    }
}
'

curl -XGET 'localhost:9200/megacorp/employee/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query" : {
        "bool" : {
            "must" : {
                "match" : {
                    "last_name" : "smith" 
                }
            },
            "filter" : {
                "range" : {
                    "age" : { "gt" : 30 } 
                }
            }
        }
    }
}
'

curl -XGET 'localhost:9200/megacorp/employee/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match" : {
            "about" : "rock climbing"
        }
    }
}
'

