

# https://www.elastic.co/guide/en/elasticsearch/guide/current/_indexing_employee_documents.html

echo "DELETE"

curl -XDELETE 'localhost:9200/hc?pretty'

echo "++++++++++++ insert data "

curl -XPUT 'localhost:9200/hc/contribution/1?pretty' -H 'Content-Type: application/json' -d'
{
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
}
'
curl -XPUT 'localhost:9200/hc/contribution/2?pretty' -H 'Content-Type: application/json' -d'
{
    "first_name" :  "Jane",
    "last_name" :   "Smith",
    "age" :         32,
    "about" :       "I like to collect rock albums",
    "interests":  [ "music" ]
}
'
curl -XPUT 'localhost:9200/hc/contribution/3?pretty' -H 'Content-Type: application/json' -d'
{
    "first_name" :  "Douglas",
    "last_name" :   "Fir",
    "age" :         35,
    "about":        "I like to build cabinets",
    "interests":  [ "forestry" ]
}
'


echo "++++++++++++++ retrieve data by id "
curl -XGET 'localhost:9200/hc/contribution/1?pretty'


echo "+++++++++ search all ..."
curl -XGET 'localhost:9200/hc/contribution/_search?pretty'

echo "search by field"
curl -XGET 'localhost:9200/megacorp/employee/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    }
}
'

