mkdir -p ~/nfs-home
sshfs 28087887@bach.sun.ac.za:/home/28087887 ~/nfs-home
~/nfs-home/cs-stow.sh ~/nfs-home --backup
ln -s ~/nfs-home/Projects ~/
ln -s ~/nfs-home/Software ~/

setxkbmap -option caps:swapescape # maybe remap caps?
