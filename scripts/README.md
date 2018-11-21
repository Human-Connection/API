# How to use the backup script

The backup script is intended to be used as a cron job or as a single command from your laptop.
It uses SSH tunneling to a remote host and dumps the mongo database on your machine.
Therefore, a public SSH key needs to be copied to the remote machine.

# Usage

All parameters must be supplied as environment variables:

| Name                  | required  |
|-----------------------|-----------|
| SSH\_USERNAME         | yes       |
| SSH\_HOST             | yes       |
| MONGODB\USERNAME      | yes       |
| MONGODB\PASSWORD      | yes       |
| MONGODB\_DATABASE     | yes       |
| OUTPUT                |           |

After exporting these environment variables to your bash, run:
```
./remote-dump.sh
```

