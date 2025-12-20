using AutoMapper;
using CegCRMAPI.Application.DTOs.Note;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Note.GetNotesForSale
{
    public class GetNotesForSaleQuery : IRequest<ApiResponse<List<NoteDto>>>
    {
        public Guid SaleId { get; set; }
    }

    public class GetNotesForSaleQueryHandler : IRequestHandler<GetNotesForSaleQuery, ApiResponse<List<NoteDto>>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IMapper _mapper;

        public GetNotesForSaleQueryHandler(INoteRepository noteRepository, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<NoteDto>>> Handle(GetNotesForSaleQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var notes = await _noteRepository.GetNotesBySaleIdAsync(request.SaleId);
                var noteDtos = _mapper.Map<List<NoteDto>>(notes);
                return ApiResponse<List<NoteDto>>.CreateSuccess(noteDtos, "Notes retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<NoteDto>>.CreateError($"Failed to retrieve notes: {ex.Message}");
            }
        }
    }
} 