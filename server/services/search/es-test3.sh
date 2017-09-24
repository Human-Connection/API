
curl -XDELETE 'localhost:9200/hc?pretty'

curl -XPUT 'localhost:9200/hc/contribution/1/?pretty' -H 'Content-Type: application/json' -d'
{
    "title"        : "Catch the quick brown fox",
    "content"      : "A quick brown cat jumped over the fence.",
    "user_id"      : "User1",
    "date"         : "2017-10-01"
}
'

curl -XPUT 'localhost:9200/hc/contribution/2/?pretty' -H 'Content-Type: application/json' -d'
{
    "title"        : "Catch the quick red cat",
    "content"      : "A quick brown fox jumped over the fence.",
    "user_id"      : "User2",
    "date"         : "2017-10-02"
}
'

curl -XPUT 'localhost:9200/hc/contribution/3/?pretty' -H 'Content-Type: application/json' -d'
{
    "title"        : "Catch the quick red fish",
    "content"      : "A quick brown fish jumped over the fence.",
    "user_id"      : "User2",
    "date"         : "2017-10-02"
}
'





echo "++++++++++++++ retrieve data by id "
curl -XGET 'localhost:9200/hc/contribution/1?pretty'


echo "+++++++++ search all ..."
curl -XGET 'localhost:9200/hc/contribution/_search?pretty'





echo "search by filter"

curl -XGET 'localhost:9200/hc/contribution/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query": {
       "bool" : {
            "should" : {
                "term" : { "title" : "fox" }
            },
            "should" : {
                "term" : { "content" : "fox" }
            }
        }
    }
}
'
