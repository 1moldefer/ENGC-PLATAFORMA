
// Mock implementation of Gemini service (or real if key is present)
// Replace with actual API call execution

export const askTechnicalAssistant = async (prompt: string): Promise<string> => {
    console.log("Asking Gemini (Mock):", prompt);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple keyword matching for demo purposes
    const lower = prompt.toLowerCase();

    if (lower.includes('autoclave') || lower.includes('preventiva')) {
        return `**Checklist Sugerido para Autoclave:**
1. Verificar integridade da guarnição da porta.
2. Testar válvulas de segurança.
3. Conferir nível de água no reservatório (se aplicável).
4. Validar ciclo de teste Bowie-Dick.
5. Limpar filtro da câmara.

*Recomendação:* Consulte o manual do fabricante para especificações de pressão e temperatura.`;
    }

    if (lower.includes('norma') || lower.includes('iec') || lower.includes('segurança')) {
        return `De acordo com a **NBR IEC 60601-1** (Segurança Elétrica):
- É obrigatório o teste de resistência de aterramento (< 0.2 ohms).
- Verificar correntes de fuga (terra e carcaça).
- Inspecionar cabos de alimentação quanto a danos físicos.
- Testes devem ser realizados anualmente ou pós-manutenção corretiva.`;
    }

    if (lower.includes('tomografo') || lower.includes('erro')) {
        return `**Protocolo de Falha para Tomógrafo:**
1. Registre o código de erro exibido no console.
2. Reinicie o sistema (Cold Boot) se permitido pelo protocolo.
3. Verifique a temperatura da sala técnica (Ideal: 20-22°C).
4. Se o erro persistir (ex: falha de tubo ou detector), interdite o equipamento via sistema e acione o suporte do fabricante Nível 3.`;
    }

    return `Entendi sua solicitação sobre "${prompt}". 
Como assistente AI, posso ajudar com:
- Resumo de normas técnicas.
- Sugestão de checklists de manutenção.
- Diagnóstico diferencial de falhas comuns.

Por favor, seja mais específico ou forneça o modelo do equipamento para uma resposta mais precisa.`;
};
