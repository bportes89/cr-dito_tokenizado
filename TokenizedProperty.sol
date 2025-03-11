// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenizedProperty {
    struct Property {
        string registryNumber;  // Número da matrícula
        address owner;          // Proprietário
        uint256 value;         // Valor do imóvel
        bool isTokenized;      // Status de tokenização
        bool isCollateral;     // Status de garantia
    }
    
    mapping(string => Property) public properties;
    
    event PropertyTokenized(string registryNumber, address owner);
    event CollateralRegistered(string registryNumber, uint256 value);
    
    function tokenizeProperty(string memory registryNumber, uint256 value) public {
        properties[registryNumber] = Property(
            registryNumber,
            msg.sender,
            value,
            true,
            false
        );
        
        emit PropertyTokenized(registryNumber, msg.sender);
    }
    
    function useAsCollateral(string memory registryNumber) public {
        require(properties[registryNumber].owner == msg.sender, "Apenas o proprietario pode usar como garantia");
        require(properties[registryNumber].isTokenized, "Imovel nao esta tokenizado");
        
        properties[registryNumber].isCollateral = true;
        
        emit CollateralRegistered(registryNumber, properties[registryNumber].value);
    }
}