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
| GPG\_PASSWORD         |           |

If you set `GPG_PASSWORD`, the resulting archive will be encrypted (symmetrically, with the given passphrase).
This is recommended if you dump the database on your personal laptop because of data security.

After exporting these environment variables to your bash, run:

```bash
./remote-dump.sh
```


# Import into your local mongo db (optional)

Run (but change the file name accordingly):
```bash
mongorestore --gzip --archive=human-connection-dump_2018-11-21.archive
```

If you previously encrypted your dump, run:
```bash
gpg --decrypt human-connection-dump_2018-11-21.archive.gpg | mongorestore --gzip --archive
```

