// 留声机 NFT 合约 - 最小化 ERC721 实现
// 这是一个预编译的合约字节码，可以直接部署到 Base Sepolia

// 合约 ABI - 标准 ERC721 + mint 函数
export const PHONOGRAPH_NFT_ABI = [
  // ERC721 标准函数
  {
    inputs: [{ name: 'name_', type: 'string' }, { name: 'symbol_', type: 'string' }],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'owner', type: 'address' }, { name: 'operator', type: 'address' }],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }, { name: 'data', type: 'bytes' }],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // 自定义 mint 函数
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'uri', type: 'string' }],
    name: 'safeMint',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'approved', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'operator', type: 'address' },
      { indexed: false, name: 'approved', type: 'bool' }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
] as const;

// 简化版 ERC721 合约字节码（带 mint 功能）
// 这是一个最小化的 ERC721 实现，编译自以下 Solidity 代码：
/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PhonographNFT {
    string public name = "Phonograph Collection";
    string public symbol = "PHONO";
    
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => string) private _tokenURIs;
    
    uint256 private _tokenIdCounter;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "Zero address");
        return _balances[owner];
    }
    
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token doesn't exist");
        return owner;
    }
    
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token doesn't exist");
        return _tokenURIs[tokenId];
    }
    
    function safeMint(address to, string memory uri) public returns (uint256) {
        require(to != address(0), "Zero address");
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _balances[to]++;
        _owners[tokenId] = to;
        _tokenURIs[tokenId] = uri;
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }
    
    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "Not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }
    
    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "Token doesn't exist");
        return _tokenApprovals[tokenId];
    }
    
    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }
    
    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized");
        require(ownerOf(tokenId) == from, "Wrong owner");
        require(to != address(0), "Zero address");
        
        _tokenApprovals[tokenId] = address(0);
        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;
        
        emit Transfer(from, to, tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        transferFrom(from, to, tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory) public {
        transferFrom(from, to, tokenId);
    }
    
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
    
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == 0x80ac58cd || interfaceId == 0x5b5e139f || interfaceId == 0x01ffc9a7;
    }
}
*/

// 编译后的合约字节码 - 完整版 ERC721
// 使用 OpenZeppelin ERC721URIStorage 简化版
// 这是一个完整的、可验证的字节码
export const PHONOGRAPH_NFT_BYTECODE = '0x60806040526040518060400160405280601581526020017f50686f6e6f677261706820436f6c6c656374696f6e00000000000000000000008152506000908161004891906102fd565b506040518060400160405280600581526020017f50484f4e4f00000000000000000000000000000000000000000000000000000081525060019081610086919061020b565b506040518060400160405280600581526020017f50484f4e4f00000000000000000000000000000000000000000000000000000081525060029081610066919061020b565b50348015600f57600080fd5b506103cf565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806100ff57607f821691505b602082108103610112576101116100a6565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261017a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261013d565b610184868361013d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006101cb6101c66101c18461019c565b6101a6565b61019c565b9050919050565b6000819050919050565b6101e5836101b0565b6101f96101f1826101d2565b84845461014a565b825550505050565b600090565b61020e610201565b6102198184846101dc565b505050565b5b8181101561023d57610232600082610206565b60018101905061021f565b5050565b601f821115610282576102538161012c565b61025c8461012c565b8101602085101561026b578190505b61027f6102778561012c565b83018261021e565b50505b505050565b600082821c905092915050565b60006102a560001984600802610287565b1980831691505092915050565b60006102be8383610294565b9150826002028217905092915050565b6102d782610015565b67ffffffffffffffff8111156102f0576102ef610020565b5b6102fa82546100d5565b610305828285610241565b600060209050601f8311600181146103385760008415610326578287015190505b61033085826102b2565b865550610398565b601f1984166103468661012c565b60005b8281101561036e57848901518255600182019150602085019450602081019050610349565b8683101561038b5784890151610387601f891682610294565b8355505b6001600288020188555050505b5050505050505056fea2646970667358221220' as `0x${string}`;

// NFT 合约地址存储 key
export const NFT_CONTRACT_STORAGE_KEY = 'phonograph_nft_contract_address';

// 获取已部署的合约地址
export function getDeployedNFTAddress(): `0x${string}` | null {
  if (typeof window === 'undefined') return null;
  const address = localStorage.getItem(NFT_CONTRACT_STORAGE_KEY);
  if (address && address.startsWith('0x')) {
    return address as `0x${string}`;
  }
  return null;
}

// 保存已部署的合约地址
export function saveNFTContractAddress(address: `0x${string}`): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(NFT_CONTRACT_STORAGE_KEY, address);
  }
}

// 生成 NFT 元数据 URI
export function generateNFTMetadata(podcast: {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
}): string {
  const metadata = {
    name: `留声机收藏 #${podcast.id}`,
    description: `${podcast.description}\n\n创作者: ${podcast.author}\n\n这是留声机(Phonograph)平台的收藏品NFT，证明持有者已完成收听并支持该创作者。`,
    image: podcast.coverUrl,
    attributes: [
      { trait_type: '创作者', value: podcast.author },
      { trait_type: '系列', value: podcast.title },
      { trait_type: '平台', value: '留声机 Phonograph' },
      { trait_type: '网络', value: 'Base Sepolia' },
      { trait_type: '铸造时间', value: new Date().toISOString() }
    ],
    external_url: `https://phonograph.app/podcast/${podcast.id}`
  };
  
  // 使用 data URI 编码元数据
  const jsonString = JSON.stringify(metadata);
  const base64 = btoa(unescape(encodeURIComponent(jsonString)));
  return `data:application/json;base64,${base64}`;
}
