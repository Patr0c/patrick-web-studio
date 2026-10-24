"""Rectify archived GIMP surfaces for registration on the common-camera planes."""
from pathlib import Path
from PIL import Image
import cv2,numpy as np
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'assets/scene/seated/materials';OUT.mkdir(exist_ok=True)
def rectify(name,quad,size):
 im=np.array(Image.open(ROOT/('assets/scene/'+name+'.webp')).convert('RGBA'))
 target=np.float32([[0,0],[size[0]-1,0],[size[0]-1,size[1]-1],[0,size[1]-1]])
 H=cv2.getPerspectiveTransform(np.float32(quad),target)
 result=cv2.warpPerspective(im,H,size,flags=cv2.INTER_LANCZOS4)
 Image.fromarray(result).save(OUT/(name+'.png'))
rectify('keyboard',[[81,18],[866,18],[919,198],[23,198]],(1404,450))
rectify('keyboard-labels',[[81,18],[866,18],[919,198],[23,198]],(1404,450))
rectify('mousepad',[[90,1],[1508,1],[1598,215],[1,215]],(1600,500))
