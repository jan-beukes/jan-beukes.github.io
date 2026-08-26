NFS_HOME=~/nfs-home
ME=$(whoami)
mkdir -p $NFS_HOME
sshfs $USER@bach.sun.ac.za:/home/$ME $NFS_HOME
$NFS_HOME/cs-stow.sh $NFS_HOME --backup

echo "Running custom symlinks in link.sh"
if [[ -e $NFS_HOME/link.sh ]]; then
    $NFS_HOME/link.sh
fi

echo -e "\033[32mDONE\033[m"
